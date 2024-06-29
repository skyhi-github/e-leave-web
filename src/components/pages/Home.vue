<template>
    <v-toolbar
        image="https://visme.co/blog/wp-content/uploads/2020/11/header.gif"
        dark
        prominent
      >
        <v-toolbar-title class="lilita-one-regular">E-Leave</v-toolbar-title>

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
            <v-list-item-title class="lilita-one-regular">
             {{ user.first_name }} {{ user.last_name }}<v-btn variant="text" icon="mdi-content-copy" size="x-small" style="float: flex-end;" />
            </v-list-item-title>
            <v-list-item-subtitle style="white-space: nowrap;" class="teko-employee">{{ user.email }}</v-list-item-subtitle>
            <v-list-item-subtitle style="white-space: nowrap;" class="teko-employee">{{ user.employee_id }}</v-list-item-subtitle>
          </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact">
            <v-list-item class="chakra-petch-semibold" prepend-icon="mdi-calendar-arrow-left" title="Apply Leave" value="Leave" active></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 53.125rem">

          <v-card color="success">
            <v-card-title style="width: 53.75rem" class="exo-2-leave-history">
                Leave History 
               <v-btn color="success" icon="mdi-refresh" size="large" variant="flat"  @click="getUserLeaveApplication">
               </v-btn>
               <v-chip
                  class="ma-2"
                  color="green-darken-4"
                  label
                  style="float: right;"
                >
                  <b>Ctrl + C</b>
                </v-chip>
              </v-card-title>
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
                    <h3>Status</h3>
                  </th>
                </tr>
              </thead>
              <tbody>

                <tr
                  v-for="item in leave"
                  :key="item.hash_id"  @click="getLeaveTrack(item)"
                >
                  <td class="text-center poetsen-one-regular">{{ item.created_at }}</td>
                  <td class="text-center poetsen-one-regular">{{ item.leave_type }}</td>
                  <td class="text-center poetsen-one-regular">{{ item.start_date }}</td>
                  <td class="text-center poetsen-one-regular">{{ item.end_date }}</td>
                  <td class="text-center poetsen-one-regular">{{ item.status }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <v-col style="margin-top: 31.875rem; margin-left: -5rem;" cols="auto">
            <v-btn icon="mdi-plus" size="large" @click="openDialog"></v-btn>
          </v-col>

          <v-dialog v-model="applyLeaveDialog">

              <v-fade-transition height="100%" hide-on-leave>
                <v-card
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

                    <v-form @keyup.esc="closeDialog" @keyup.enter="createLeaveApplication">
                      <v-container>

                        <v-card-title style="margin-top: -4.375rem;" class="text-h6 "></v-card-title>

                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                          >
                          <v-select
                            v-model="select"
                            :items="leaveTypes"
                            label="Leave Type"
                            variant="outlined"
                            required
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
                          <v-text-field v-model="others"
                                        v-if="select === 'Other:'"
                                        variant="outlined"
                                        label="Other:"

                          >

                        </v-text-field>

                          </v-col>

                        </v-row>
                        <v-row>
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

          <v-snackbar
          v-model="snackbar_delete"
          :timeout="2000"
          color="error"
          variant="tonal"
          >
          ❌ <b>Leave Created Success</b>
          </v-snackbar>

        </v-main>

        <v-navigation-drawer temporary location="right" v-model="leaveTrackDialog">

          <v-card color="success">
            <v-card-title>Leave Track <v-btn variant="tonal" style="float: right; color: red;" text="DELETE" @click="deleteLeaveApplication" /> </v-card-title>
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

            </v-timeline>
          </v-container>
        </v-navigation-drawer>
      </v-layout>
    </v-card>

    <v-footer class="footer" fixed pad>
      <span class="sofia-sans-condensed">Version 1.0</span>
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

      others: undefined,

      startDate: null,

      endDate: null,

      backToWorkDate: null,

      applyLeaveDialog: false,

      leaveTrackDialog: false,

      deleteItem: undefined,

      profileDialog: false,

      loading: false,

      reason: null,

      duration: null,

      user: {},

      leave: {},

      leavePayload: {},

      snackbar: false,

      snackbar_delete: false,

      leaveTypes: [
        { title: 'Annual Leave' },
        { title: 'Personal Leave' }
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

      this.deleteItem = id?.hash_id;

      axios.get(`/v1/leave/${id?.hash_id}`)
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
        "leave_type": this.select == 'Other:' ? this.others : this.select,
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
        this.others = undefined;
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

    deleteLeaveApplication() {

      const payload = this.deleteItem;

      axios.delete(`/v1/leave/delete/${payload}`)
      .then((r) => {

        this.getUserLeaveApplication();
        this.leaveTrackDialog = false;
        this.snackbar_delete = true;

          return r
      })
      .catch((e) => {
        this.getUserLeaveApplication();
        this.leaveTrackDialog = false;
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
      this.snackbar_delete = false;
      this.startDate = undefined;
      this.endDate = undefined;
      this.others = undefined;
      this.select = null;
      this.duration = undefined;
      this.backToWorkDate = undefined;
      this.reason = undefined;
    },

    calculateLeaveDuration(startDate, endDate) {

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const durationMillis = endDateTime - startDateTime;

    const totalHours = durationMillis / (1000 * 60 * 60);
    const breakDuration = this.calculateBreakHours(startDate, endDate);
    const workingHours = totalHours - breakDuration;

    const leaveDuration = Math.min(workingHours);

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
        if (i === 12) {
          arr.push({ text: '12 PM', value: 12 });
          continue;
        }

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
      return [
              { text: '00', value: 0 },
              { text: '15', value: 15 },
              { text: '30', value: 30 },
              { text: '45', value: 45 }
             ];
    },
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKey);
  },

};
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@700&family=Kufam:ital,wght@0,400..900;1,400..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@300..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&family=Teko:wght@300..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poetsen+One&family=Teko:wght@300..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Sofia+Sans+Condensed:ital,wght@0,1..1000;1,1..1000&display=swap');

.sofia-sans-condensed {
  font-family: "Sofia Sans Condensed", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.lilita-one-regular {
  font-family: "Lilita One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.poetsen-one-regular {
  font-family: "Poetsen One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.exo-2-leave-history {
  font-family: "Exo 2", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}

.chakra-petch-semibold {
  font-family: "Chakra Petch", sans-serif;
  font-weight: 600;
  font-style: normal;
}

.teko-employee {
  font-family: "Teko", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.lilita-one-regular {
  font-family: "Lilita One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.kufam-leave-history {
  font-family: "Kufam", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

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

.footer {
   left: 0;
   bottom: 0;
   width: 100%;
   background-color: red;
   color: white;
   text-align: center;
}

</style>
