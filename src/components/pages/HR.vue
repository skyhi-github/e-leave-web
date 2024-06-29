<template>
    <v-toolbar
        image="https://cdn.dribbble.com/users/8397981/screenshots/15955593/media/cf6610fde1a8d28e4967d846ebaf38fe.gif"
        dark
        prominent
      >
        <v-toolbar-title style="color: aquamarine; font-weight: bold; font-family:Arial, Helvetica, sans-serif;">E-Leave</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="red" class="text-none" stacked>
            <v-badge color="red" content="100">
                <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
        </v-btn>

    </v-toolbar>

    <v-card>
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail
        >
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
            >
            <v-list-item-title>
             {{ user.first_name }} {{ user.last_name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ user.employee_id }}</v-list-item-subtitle>
          </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact">
            <v-list-item class="apply-leave-button" prepend-icon="mdi-calendar-arrow-left" title="Leave Request" value="Leave" active></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 39.063rem;">

        </v-main>
      </v-layout>
    </v-card>

    <v-footer fixed pad>
      <span>Version 1.0</span>
    </v-footer>

</template>

<script>

import axios from 'axios';


export default {

  name: 'Home',

  data() {
    return {

      timelineItems: [],

      select: undefined,

      startDate: null,

      endDate: null,

      backToWorkDate: null,

      applyLeaveDialog: false,

      leaveTrackDialog: false,

      profileDialog: false,

      loading: false,

      reason: null,

      duration: null,

      user: {},

      leave: {},

      leavePayload: {},

      snackbar: false,

      leaveTypes: [
        { title: 'Annual Leave' },
        { title: 'Sick Leave' },
        { title: 'Personal Leave' },
        { title: 'Maternity Leave' },
      ],

    };
  },

  created() {
    this.getUser();
    this.getUserLeaveApplication();
    window.addEventListener('keydown', this.handleKey);


    if(localStorage.getItem('token') == "" || localStorage.getItem('token') == null){
      this.$router.push('/login')
    }

  },

  methods: {
    getUser() {
      axios.get('/v1/user', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
      .then((r) => {
          this.user = r.data;
          return r
      })
      .catch((e) => {
          return e
      });
    },

    getUserLeaveApplication() {
      axios.get('/v1/leave', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((r) => {
           this.leave = r.data;
           return r
        })
        .catch((e) => {
           return e
        });
    },

    getLeaveTrack(id){

      axios.get(`/v1/leave/${id?.id}`)
        .then((r) => {
           this.timelineItems = r.data;
           this.leaveTrackDialog = true;
           return r
        })
        .catch((e) => {
           return e
        });
    },

    createLeaveApplication() {

      this.leavePayload = {
        "employee_id": this.user?.employee_id,
        "department_name": this.user?.department_name,
        "start_date": this.startDate,
        "end_date": this.endDate,
        "leave_type": this.select,
        "duration": this.duration,
        "back_to_work_date": this.backToWorkDate,
        "reason": this.reason,
        "approver_id": this.user?.manager_id
      };

      const payload = this.leavePayload;


      axios.post('/v1/leave/create', payload)
      .then((r) => {

        this.getUserLeaveApplication();

        this.applyLeaveDialog = false;
        this.snackbar = true;
        this.startDate = undefined;
        this.endDate = undefined;
        this.select = undefined;
        this.duration = undefined;
        this.backToWorkDate = undefined;
        this.reason = undefined;

          return r
      })
      .catch((e) => {
        this.getUserLeaveApplication();
        return e
      });

    },

    logout () {
      axios.post('/v1/auth/logout',{}, { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
      .then((r) => {
          localStorage.setItem('token', "")
          this.$router.push('/login')
          return r
      })
      .catch((e) => {
        return e
      });
    },

    openDialog(){
      this.applyLeaveDialog = true;
    },

    handleKey(event) {
      if (event.ctrlKey && event.key === 'c') {

        this.applyLeaveDialog = true;

      }
    },

    closeDialog(){
      this.applyLeaveDialog = false;
      this.applyLeaveDialog = false;
      this.snackbar = false;
      this.startDate = undefined;
      this.endDate = undefined;
      this.select = null;
      this.duration = undefined;
      this.backToWorkDate = undefined;
      this.reason = undefined;
    },

    calculateLeaveDuration(startDate, endDate) {

    // Convert input dates to JavaScript Date objects
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Calculate the total duration in milliseconds
    const durationMillis = endDateTime - startDateTime;

    // Calculate the duration in hours (excluding break time)
    const totalHours = durationMillis / (1000 * 60 * 60);
    const breakDuration = this.calculateBreakHours(startDate, endDate); // Break duration in hours
    const workingHours = totalHours - breakDuration;

    // Calculate the leave duration (considering working hours only)
    const leaveDuration = Math.min(workingHours); // Maximum of 8 hours per day

    return leaveDuration+` Hour(s)`;
    },

    clearDuration(){
      this.duration ='';
    },

    handleDate(date){

      console.log(date);

    }

  },

  computed: {

    hoursArray() {
      const arr = [];
      for (let i = 7; i <= 16; i++) {
        if (i === 12) continue; // Skip 12 PM

        const isAm = i < 12;
        const hourText = isAm ? i : i - 12;
        arr.push({
          text: `${isAm ? hourText : '0' + (hourText % 12)} ${isAm ? 'AM' : 'PM'}`,
          value: i,
        });
      }
      return arr;
    },

    minutesArray() {
      return [{ text: '00', value: 0 }];
    },
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKey);
  },

};
</script>

<style lang="scss">

tbody tr:hover {
  background-color: #67af6a;
  cursor: pointer;
}

tbody tr:active {
  background-color: rgba(23, 255, 127, 0.43);
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.dp-custom-input {
  box-shadow: 0 0 0.063rem #1976d2;
  color: #1976d2;
  height: 55px;

  &:hover {
    border-color: pink;
  }
}

.dp-custom-input-range {
  box-shadow: 0 0 0.063rem #1976d2;
  color: #1976d2;
  height: 55px;

  &:hover {
    border-color: pink;
  }
}

option {
  background: #b0d6ff;
  border-color: aquamarine;

}

select{
  background: #1976d2;
  color: white;
  text-align: center;

}

.leave-track {
  display: contents;
  white-space: nowrap;

}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

.custom-time-picker-component {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #67af6a;
}

.select-input {
  margin: 5px 3px;
  padding: 5px;
  width: 100px;
  border-radius: 4px;
  border-color: black;
  outline: none;
}

</style>
