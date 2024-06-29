<template>
    <v-toolbar
        image="https://visme.co/blog/wp-content/uploads/2020/11/header.gif"
        dark
        prominent
      >
        <v-toolbar-title>E-Leave</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="red" @click="logout">
          <v-icon>mdi-export</v-icon>
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
          </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact">
            <v-list-item class="apply-leave-button" prepend-icon="mdi-calendar-arrow-left" title="Apply Leave" value="Leave" active></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 39.063rem;">

          <v-card color="success">
            <v-card-title style="width: 53.75rem">Leave History <v-btn color="success" icon="mdi-refresh" size="large"  @click="getUserLeaveApplication"></v-btn> </v-card-title>
            <v-table>
              <thead>
                <tr>
                  <th class="text-center">
                    <h3>Created At</h3>
                  </th>
                  <th class="text-center">
                    <h3>Leave Type</h3>
                  </th>
                  <th class="text-center">
                    <h3>Start Date</h3>
                  </th>
                  <th class="text-center">
                    <h3>End Date</h3>
                  </th>
                  <th class="text-center">
                    <h3>Duration</h3>
                  </th>
                  <th class="text-center">
                    <h3>Back To Work</h3>
                  </th>
                  <th class="text-center">
                    <h3>Status</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in leave"
                  :key="item.id"  @click="getLeaveTrack(item)"
                >
                  <td class="text-center;">{{ item.created_at }}</td>
                  <td class="text-center">{{ item.leave_type }}</td>
                  <td class="text-center">{{ item.start_date }}</td>
                  <td class="text-center">{{ item.end_date }}</td>
                  <td class="text-center">{{ item.duration }}</td>
                  <td class="text-center">{{ item.back_to_work_date }}</td>
                  <td class="text-center">{{ item.status }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <v-col style="margin-top: 31.875rem; margin-left: -5rem;" cols="auto">
            <v-btn icon="mdi-plus" size="large"  @click="openDialog"></v-btn>
          </v-col>

          <v-dialog v-model="profileDialog">

          <v-card-title style="margin-top: -3.125rem;" class="text-h6 ">Employee Information</v-card-title>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hint="Example: Doung Dara"
                label="Employee Name"
                model-value="Grocery delivery"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hint="Example: 009890"
                label="Employee ID"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hint="Example: MIS"
                label="Department"
                model-value="MIS"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                hint="Example: IT Support"
                label="Position"
                variant="outlined"
              ></v-text-field>
            </v-col>

          </v-row>

          </v-dialog>

          <v-dialog v-model="applyLeaveDialog">

              <v-fade-transition height="100%" hide-on-leave>
                <v-card
                  append-icon="$close"
                  class="mx-auto"
                  elevation="16"
                  width="31.25rem"
                  title="Create Leave Application"
                >
                  <template v-slot:append>
                    <v-btn icon="$close" variant="text" @click="closeDialog"></v-btn>
                  </template>

                  <v-divider></v-divider>

                  <div class="py-12 text-center">

                    <v-form>
                      <v-container>

                        <v-card-title style="margin-top: -4.375rem;" class="text-h6 "></v-card-title>

                        <v-row>
                          <v-col
                            cols="12"
                            sm="12"
                          >
                          <v-select
                            v-model="select"
                            :items="leaveTypes"
                            label="Leave Type"
                            clearable
                            hide-selections
                          >
                      <template v-slot:selection="data">
                        <v-chip
                          :key="JSON.stringify(data.item)"
                          v-bind="data.attrs"
                          :disabled="data.disabled"
                          :model-value="data.selected"
                          size="large"
                          @click:close="data.parent.selectItem(data.item)"
                        >
                          <template v-slot:prepend>
                            <v-avatar class="bg-accent text-uppercase" style="color: palevioletred;" start>
                              {{ data.item.title.slice(0, 1) }}
                            </v-avatar>
                          </template>
                          {{ data.item.title }}
                        </v-chip>
                      </template>
                          </v-select>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                          >
                          <VueDatePicker v-model="startDate"
                          @update:model-value="handleDate"
                          text-input
                          teleport-center
                          placeholder="From Date"
                          input-class-name="dp-custom-input-range"
                          :disabled-week-days="[7, 0]"
                          @cleared="clearDuration"
                          :is-24="false"

                          time-picker-outline

                          >

                          <template #time-picker="{ time, updateTime }">
                            <div class="custom-time-picker-component">
                              <select
                                class="select-input"
                                :value="time.hours"
                                @change="updateTime(+$event.target.value) "
                              >
                                <option
                                  v-for="h in hoursArray"
                                  :key="h.value"
                                  :value="h.value">{{ h.text }}</option>
                              </select>
                              <select
                                class="select-input"
                                :value="time.minutes"
                                @change="updateTime(+$event.target.value, false)"
                              >
                                <option
                                  v-for="m in minutesArray"
                                  :key="m.value"
                                  :value="m.value">{{ m.text }}</option>
                              </select>
                            </div>
                          </template>

                          </VueDatePicker>

                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                          >
                          <VueDatePicker v-model="endDate"
                          @update:model-value="handleDate"
                          text-input
                          teleport-center
                          placeholder="End Date"
                          input-class-name="dp-custom-input-range"
                          :disabled-week-days="[7, 0]"
                          @cleared="clearDuration"
                          :is-24="false"

                          time-picker-outline

                          >

                          <template #time-picker="{ time, updateTime }">
                            <div class="custom-time-picker-component">
                              <select
                                class="select-input"
                                :value="time.hours"
                                @change="updateTime(+$event.target.value) "
                              >
                                <option
                                  v-for="h in hoursArray"
                                  :key="h.value"
                                  :value="h.value">{{ h.text }}</option>
                              </select>
                              <select
                                class="select-input"
                                :value="time.minutes"
                                @change="updateTime(+$event.target.value, false)"
                              >
                                <option
                                  v-for="m in minutesArray"
                                  :key="m.value"
                                  :value="m.value">{{ m.text }}</option>
                              </select>
                            </div>
                          </template>

                          </VueDatePicker>

                          </v-col>

                        </v-row>

                        <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="1 Hour(s)"
                              label="Duration"
                              v-model="duration"
                              variant="outlined"
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                          <VueDatePicker v-model="backToWorkDate"
                          @update:model-value="handleDate"
                          text-input
                          teleport-center
                          placeholder="Back to Working Date"
                          input-class-name="dp-custom-input-range"
                          :disabled-week-days="[7, 0]"
                          @cleared="clearDuration"
                          :is-24="false"

                          time-picker-outline

                          >

                          <template #time-picker="{ time, updateTime }">
                            <div class="custom-time-picker-component">
                              <select
                                class="select-input"
                                :value="time.hours"
                                @change="updateTime(+$event.target.value) "
                              >
                                <option
                                  v-for="h in hoursArray"
                                  :key="h.value"
                                  :value="h.value">{{ h.text }}</option>
                              </select>
                              <select
                                class="select-input"
                                :value="time.minutes"
                                @change="updateTime(+$event.target.value, false)"
                              >
                                <option
                                  v-for="m in minutesArray"
                                  :key="m.value"
                                  :value="m.value">{{ m.text }}</option>
                              </select>
                            </div>
                          </template>

                          </VueDatePicker>
                        </v-col>

                          <v-col cols="12">
                            <v-text-field
                              v-model="reason"
                              hint="Tell us your leave reason"
                              label="Reason"
                              variant="filled"
                              clearable
                              maxlength=100
                              counter
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>

                  </div>

                  <div class="pa-4 text-end">
                    <v-btn
                    class="me-2 text-none"
                    color="pink"
                    prepend-icon="mdi-send-circle"
                    :loading="loading"
                    size="x-large"
                    variant="flat"
                    @click="createLeaveApplication"
                    >
                    Send
                    </v-btn>
                  </div>
                </v-card>
              </v-fade-transition>

          </v-dialog>
                    <v-snackbar
                    v-model="snackbar"
                    :timeout="2000"
                    color="success"
                    variant="tonal"
                    >
                    ✅ <b>Leave Created Success</b>
                    </v-snackbar>

        </v-main>

        <v-navigation-drawer temporary location="right" v-model="leaveTrackDialog">

          <v-card color="success">
            <v-card-title>Leave Track</v-card-title>
          </v-card>

          <v-container class="leave-track">
            <v-timeline align="start" side="end">

                <v-timeline-item
                  size="small"
                  v-for="item in timelineItems"
                  :key="item.leave_app_status"
                  :dot-color="item.color"
                >
                  <div class="d-flex">
                    <strong class="me-4">{{ item.leave_app_status }}</strong>
                  </div>
                  <div class="d-flex">
                    <i class="me-4">{{ item.create_at }}</i>
                  </div>
                </v-timeline-item>

                <!-- <v-timeline-item
                  dot-color="blue"
                  size="small"
                >
                <div class="d-flex">
                    <strong class="me-4">HR Approved</strong>
                  </div>
                  <div class="d-flex">
                    <i class="me-4">3:00PM 20/06/2024</i>
                  </div>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="teal-lighten-3"
                  size="small"
                >
                <div class="d-flex">
                    <strong class="me-4">Manager Approved</strong>
                  </div>
                  <div class="d-flex">
                    <i class="me-4">3:00PM 20/06/2024</i>
                  </div>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="pink"
                  size="small"
                >
                  <div class="d-flex">
                    <strong class="me-4">Application Created</strong>
                  </div>
                  <div class="d-flex">
                    <i class="me-4">3:00PM 20/06/2024</i>
                  </div>
                </v-timeline-item> -->

            </v-timeline>
          </v-container>
        </v-navigation-drawer>
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

      select: null,

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
        this.startDate = '';
        this.endDate = '';
        this.select = '';
        this.duration = '';
        this.backToWorkDate = '';
        this.reason = '';

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

    closeDialog(){
      this.applyLeaveDialog = false;
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
