<template>
  <v-toolbar
      image="/src/assets/header.gif"
      dark
      prominent
    >
      <div class="d-flex align-center">
        <img
          height="50"
          src="/src/assets/soccer.gif"
        />
        <v-toolbar-title class="lilita-one-regular">{{ displayText }}<span class="cursor">|</span></v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <span class="toolbar-divider" aria-hidden="true">|</span>

      <v-badge
        :content="alertsCount"
        color="pink"
        location="top end"
        offset-x="10"
        offset-y="10"
        :model-value="alertsCount > 0"
      >
        <v-btn icon color="blue" aria-label="Notifications">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>
        <v-btn icon color="blue" aria-label="Notifications">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
        <v-btn icon color="blue" aria-label="Notifications">
          <v-icon>mdi-translate</v-icon>
        </v-btn>

      <div class="toolbar-divider toolbar-divider--full" aria-hidden="true"></div>

      <v-btn
        color="indigo-darken-3"
        variant="flat"
        append-icon="mdi-export"
        class="logout-btn"
       @click="logout()"
      >
        Logout
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
            prepend-avatar="/src/assets/bowker-logo.svg"
          >
          <v-list-item-title class="lilita-one-regular">
           {{ user.first_name }} {{ user.last_name }}<v-btn variant="text" icon="mdi-content-copy" size="x-small" style="float: flex-end;" />
          </v-list-item-title>
          <v-list-item-subtitle v-if = "user.email" style="white-space: nowrap;" class="teko-employee">{{ user.email  }}</v-list-item-subtitle>
          <v-list-item-subtitle style="white-space: nowrap;" class="teko-employee">{{ user.employee_id }}</v-list-item-subtitle>
        </v-list-item>
        </v-list>

        <v-divider></v-divider>

          <v-tabs
            v-model="tab"
            color="primary"
            direction="vertical"
          >
         <v-tab class="chakra-petch-semibold" size="x-large" prepend-icon="mdi-calendar-arrow-left" value="option-1">E-Leave</v-tab>
         <v-divider></v-divider>
         <v-tab class="chakra-petch-semibold" size="x-large" prepend-icon="mdi-account-check" value="option-8">Attendance</v-tab>
         <v-divider></v-divider>
         <v-tab class="chakra-petch-semibold" size="x-large" prepend-icon="mdi-account-circle" value="option-2"  @click="getEmployee(); getProfile(); getTeam()">Profile</v-tab>
        </v-tabs>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center" style="height: 100vh; ">

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="option-1">

        <v-card color="#97BBE3">
          <v-card-title style="width: 53.75rem" class="exo-2-leave-history">
              Leave Record 
             <v-btn :loading="loading" color="#97BBE3" icon="mdi-refresh" size="large" variant="flat"  @click="getUserLeaveApplication"></v-btn>
             <v-btn color="#97BBE3" icon="mdi-plus" size="large" variant="flat" @click="openDialog"></v-btn>
             <v-btn color="#97BBE3" icon="mdi-cloud-search-outline" size="large" variant="flat" ></v-btn>
             <v-btn :loading="downloading" color="#97BBE3" icon="mdi-download" style = "float: right" size="large" variant="flat"  @click="downloadLeave"></v-btn>
            <v-table height="300px" fixed-header>
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
            </v-card-title>

          <v-divider></v-divider>
        </v-card>

        <v-dialog v-model="applyLeaveDialog" transition="dialog-top-transition">

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
                       <v-select
                            v-model="selectedApprover"
                            :items="approvers"
                            item-title="name"
                            item-value="employee_id"
                            label="Select Approver"
                            variant="outlined"
                            prepend-inner-icon="mdi-account-check"
                            :disabled="!select"
                        ></v-select>

                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                        <VueDatePicker v-model="startDate"
                        :disabled-dates="disabledDates"
                        :min-date="new Date()"
                        :start-date="startMinDate"
                        :start-time="{ hours: 7, minutes: 0 }"
                        text-input
                        teleport-center
                        placeholder="From Date"
                        input-class-name="dp-custom-input-range"
                        :disabled-week-days="[7, 0]"
                        @cleared="clearDuration"
                        :is-24="false"
                        :disabled="!select"
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
                                v-for="h in startHoursArray"
                                :key="h.value"
                                :value="h.value">{{ h.text }}</option>
                            </select>
                            <select
                              class="select-input"
                              :value="time.minutes"
                              @change="updateTime(+$event.target.value, false)"
                            >
                              <option
                                v-for="m in startMinutesArray"
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
                        :disabled-dates="disabledDates"
                        :min-date="minDate"
                        :start-date="endMinDate"
                        :start-time="{ hours: 16, minutes: 0 }"
                        text-input
                        teleport-center
                        placeholder="End Date"
                        input-class-name="dp-custom-input-range"
                        :disabled-week-days="[7, 0]"
                        @cleared="clearDuration"
                        :is-24="false"
                        :disabled="!startDate"
                        time-picker-outline

                        >

                        <template #time-picker="{ time, updateTime }">
                          <div class="custom-time-picker-component">
                            <select
                              class="select-input"
                              :value="time.hours"
                              @change="updateTime($event.target.value)"
                            >
                              <option
                                v-for="h in endHoursArray"
                                :disabled="h.value === 7 ? time.minutes === 0 : false"
                                :key="h.value"
                                :value="h.value">{{ h.text }}
                              </option>
                            </select>
                            <select
                              class="select-input"
                              :value="time.minutes"
                              @change="updateTime(+$event.target.value, false)"
                            >
                              <option
                                v-for="m in endMinutesArray"
                                :disabled="m.value === 0 ? time.hours === 7 : false"
                                :key="m.value"
                                :value="m.value">{{ m.text }}
                              </option>
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
                            :disabled="!endDate"
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
                  :disabled="!reason"
                  >
                  Send
                  </v-btn>
                </div>
              </v-card>

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

        </v-tabs-window-item>

        <v-tabs-window-item value="option-2">

          <v-card
            :disabled="loading"
            :loading="loading"
            class="mx-auto my-12"
            max-width="374"
            style="background-color: #F0F2F0" 
          >

          <v-img
            height="150"
            :src="profile.image"
            cover
          >
            <v-btn
              icon
              fixed 
              top
              right
              x-small
              color="white" 
              variant="text"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-img>

          <v-card-item>
            <v-card-title>{{user.first_name}} {{user.last_name}} • <v-chip  append-icon="mdi-cake-variant"
      class="ma-2 suse"
      color="pink"> {{profile?.dob}} </v-chip></v-card-title>

            <v-card-subtitle>
              <b class="me-1">{{user.department_name}}</b>

              <v-icon
                color="error"
                icon="mdi-account-group"
                size="small"
              ></v-icon>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-row
              align="center"
              class="mx-0"
            >
            <v-rating
              half-increments
              hover
              readonly
              :length="6"
              :size="32"
              :model-value="new Date().getDay()"
              color="blue-lighten-4"
              active-color="blue-accent-4"
              empty-icon="mdi-briefcase-check-outline"
              half-icon="mdi-briefcase-check-outline"
              full-icon="mdi-briefcase-check"
            />
            <div class="text-grey ms-4">
              {{today}}
            </div>
            </v-row>

            <div class="my-4 text-subtitle-1 suse">
              💼 • {{ employee.position_name }}
            </div>

            <div>
              <v-chip prepend-icon="mdi-briefcase-clock" color="blue-darken-2">
                <b>Joined</b>
              </v-chip>  
              {{ employee?.join_date }}
            </div>
            <br/>
            <div>
              <v-chip prepend-icon="mdi-island" color="green">
                <b>Annual Leave</b>
              </v-chip>  
              2 Days   
            </div>
          </v-card-text>

          <v-divider class="mx-4 mb-1"></v-divider>

          <v-card-title>Team Member</v-card-title>

          <div class="px-4 mb-2">
            <v-chip-group>

              <v-chip
                v-for="item in team"
                class="ma-2"
                color="indigo"
              >
                <v-avatar start>
                  <v-img :src="item.image"></v-img>
                </v-avatar>
                <b>{{ item.first_name }}</b>
              </v-chip>

            </v-chip-group>
          </div>

          <v-card-actions>
            <v-btn
              color="#4182CB"
              prepend-icon="mdi-key"
              text="Change Password"
              block
              border
              @click="openMenu = true"
            ></v-btn>
          </v-card-actions>
          </v-card>
          <v-dialog
    v-model="openMenu"
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-account-key"
      text="You will logout after change your password"
      title="Change Password"
    >
          <v-col
            cols="12"
            sm="12"
          >
          <v-text-field
        v-model="password"
        :readonly="loading"
        :rules="[required]"
        class="mb-2"
        label="New Password"
        variant="solo"
        clearable
      ></v-text-field>
          </v-col>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Change"
          @click="openMenu = false; updatePassword();"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
        </v-tabs-window-item>

        <v-tabs-window-item value="option-8">

        <v-card color="#97BBE3">
          <v-card-title style="width: 53.75rem" class="exo-2-leave-history">
              Attendance
            <v-btn :loading="downloading" color="#97BBE3" icon="mdi-refresh" size="large" variant="flat" @click="getUserAttendance"></v-btn>
            <v-btn color="#97BBE3" icon="mdi-magnify" size="large" variant="flat" @click="openAttendanceCalendarDialog"></v-btn>
            <v-btn :loading="downloading" color="#97BBE3" icon="mdi-download" style = "float: right" size="large" variant="flat" @click="downloadAttendance"></v-btn>
            <v-table height="300px" fixed-header>
            <thead>
              <tr>
                <th class="text-center">
                  <h3>Date</h3>
                </th>
                <th class="text-center">
                  <h3>Scan In1</h3>
                </th>
                <th class="text-center">
                  <h3>Scan Out1</h3>
                </th>
                <th class="text-center">
                  <h3>Scan In2</h3>
                </th>
                <th class="text-center">
                  <h3>Scan Out2</h3>
                </th>
              </tr>
            </thead>
            <tbody>

              <tr
                v-for="item in attendance"
              >
                <td class="text-center poetsen-one-regular">{{ item.Att_Date }}</td>
                <td class="text-center poetsen-one-regular">{{ item.Fr_Time1 }}</td>
                <td class="text-center poetsen-one-regular">{{ item.To_Time1 }}</td>
                <td class="text-center poetsen-one-regular">{{ item.Fr_Time2 }}</td>
                <td class="text-center poetsen-one-regular">{{ item.To_Time2 }}</td>
              </tr>
            </tbody>
          </v-table>
            </v-card-title>

          <v-divider></v-divider>
        </v-card>

        <v-dialog v-model="applyLeaveDialog" transition="dialog-top-transition">

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

                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                        <VueDatePicker v-model="startDate"
                        :disabled-dates="disabledDates"
                        :min-date="new Date()"
                        :start-date="startMinDate"
                        :start-time="{ hours: 7, minutes: 0 }"
                        text-input
                        teleport-center
                        placeholder="From Date"
                        input-class-name="dp-custom-input-range"
                        :disabled-week-days="[7, 0]"
                        @cleared="clearDuration"
                        :is-24="false"
                        :disabled="!select"
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
                                v-for="h in startHoursArray"
                                :key="h.value"
                                :value="h.value">{{ h.text }}</option>
                            </select>
                            <select
                              class="select-input"
                              :value="time.minutes"
                              @change="updateTime(+$event.target.value, false)"
                            >
                              <option
                                v-for="m in startMinutesArray"
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
                        :disabled-dates="disabledDates"
                        :min-date="minDate"
                        :start-date="endMinDate"
                        :start-time="{ hours: 16, minutes: 0 }"
                        text-input
                        teleport-center
                        placeholder="End Date"
                        input-class-name="dp-custom-input-range"
                        :disabled-week-days="[7, 0]"
                        @cleared="clearDuration"
                        :is-24="false"
                        :disabled="!startDate"
                        time-picker-outline

                        >

                        <template #time-picker="{ time, updateTime }">
                          <div class="custom-time-picker-component">
                            <select
                              class="select-input"
                              :value="time.hours"
                              @change="updateTime($event.target.value)"
                            >
                              <option
                                v-for="h in endHoursArray"
                                :disabled="h.value === 7 ? time.minutes === 0 : false"
                                :key="h.value"
                                :value="h.value">{{ h.text }}
                              </option>
                            </select>
                            <select
                              class="select-input"
                              :value="time.minutes"
                              @change="updateTime(+$event.target.value, false)"
                            >
                              <option
                                v-for="m in endMinutesArray"
                                :disabled="m.value === 0 ? time.hours === 7 : false"
                                :key="m.value"
                                :value="m.value">{{ m.text }}
                              </option>
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
                            :disabled="!endDate"
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
                  :disabled="!selectedApprover"
                  >
                  Send
                  </v-btn>
                </div>
              </v-card>

        </v-dialog>

        <v-dialog v-model="attendanceCalendarDialog" transition="dialog-top-transition">

          <v-card
            class="mx-auto"
            elevation="16"
            width="31.25rem"
            title="Attendance Range"
          >
            <template v-slot:append>
              <v-btn icon="$close" variant="text" @click="attendanceCalendarDialog = false"></v-btn>
            </template>

            <v-divider></v-divider>

            <div class="py-12 text-center">

              <v-form>
                <v-container>

                  <v-card-title style="margin-top: -4.375rem;" class="text-h6 "></v-card-title>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                    <VueDatePicker v-model="attendanceStartDate"
                    :enable-time-picker="false"
                    text-input
                    teleport-center
                    placeholder="From Date"
                    input-class-name="dp-custom-input-range"
                    @cleared="clearDuration"
                    :is-24="false"
                    time-picker-outline
                    >
                    </VueDatePicker>

                    </v-col>

                    <v-col
                      cols="12"
                      sm="6"
                    >
                    <VueDatePicker v-model="attendanceEndDate"
                    :enable-time-picker="false"
                    text-input
                    teleport-center
                    placeholder="From Date"
                    input-class-name="dp-custom-input-range"
                    @cleared="clearDuration"
                    :is-24="false"
                    time-picker-outline
                    :disabled="!attendanceStartDate"
                    >
                    </VueDatePicker>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

            </div>

            <div class="pa-4 text-end">
              <v-btn
              class="me-2 text-none"
              color="pink"
              prepend-icon="mdi-calendar-search"
              :loading="loading"
              size="x-large"
              variant="flat"
              @click="getAttendance(attendanceStartDate, attendanceEndDate)"
              >
              Search
              </v-btn>
            </div>
          </v-card>

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

        </v-tabs-window-item>

      </v-tabs-window>

      </v-main>

      <v-dialog v-model="leaveTrackDialog" transition="dialog-top-transition">

        <v-card
          class="mx-auto"
          elevation="16"
          width="50rem"
          title="Leave Track"
        >
          <template v-slot:append>
            <v-btn
              v-if="deleteDialog"
              class="ma-2"
              color="deep-orange-accent-3"
              icon="mdi-trash-can"
              variant="text"
              @click="deleteLeaveApplication"
            ></v-btn>
            <v-btn icon="$close" variant="text" @click="leaveTrackDialog = false"></v-btn>
          </template>

          <v-divider></v-divider>

          <div class="py-12 text-center">
            <v-container class="leave-track">
              <v-timeline direction="horizontal" side="end">

                  <v-timeline-item
                    size="large"
                    v-for="item in timelineItems"
                    :key="item.leave_app_status"
                    :dot-color="item.color"
                  >
                    <template v-slot:opposite>
                      <strong>{{ item.leave_app_status }}</strong>
                    </template>
                    <div class="d-flex flex-column align-center">
                      <div class="text-caption">{{ item.create_at }}</div>
                      <v-btn 
                        v-if="item.leave_app_status === 'HR Approved'" 
                        :loading="loading" 
                        color="success" 
                        class="mt-2" 
                        size="small"
                        prepend-icon="mdi-download"
                        @click="downloadLeaveApproval(item.download)"
                      >
                        Download
                      </v-btn>
                      <div v-else style="height: 36px; margin-top: 8px;"></div>
                    </div>
                  </v-timeline-item>

              </v-timeline>
            </v-container>
          </div>
        </v-card>

      </v-dialog>
    </v-layout>
  </v-card>
      <ChatWidget />
</template>

<script>

    import ChatWidget from '@/components/ChatWidget.vue'

import axios from 'axios';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default {

name: 'Home',

data() {
  return {

    show: false,

    displayText: '',
    phrases: ['Win Hanverky', 'Win Together', 'One Team, One Goal', 'Bowker Garment Factory (Cambodia)',],
    phraseIndex: 0,
    isDeleting: false,
    typewriterIndex: 0,
    typewriterTimer: null,

    serverItems: [],

    badgeOpacity: 1, // Initial opacity

    attendanceTableHeaders: undefined,

    attendanceCalendarDialog: false,

    today: undefined,

    new_password: {},

    attendance: [],

    attendanceStartDate: undefined,

    attendanceEndDate: undefined,

    password: '',

    openMenu: false,

    tab: undefined,

    timelineItems: [],

    select: undefined,

    startDate: null,

    endDate: null,

    backToWorkDate: null,

    applyLeaveDialog: false,

    leaveTrackDialog: false,

    deleteItem: undefined,

  deleteDialog: false,

    profileDialog: false,

    loading: false,

    downloading: false,

    reason: null,

    duration: null,

    user: {},

    employee: {},

    profile: {},

    team: {},

    leave: {},

    alertsCount: 1,

    leavePayload: {},

    snackbar: false,

    snackbar_delete: false,

    leaveTypes: [
      { title: 'Annual Leave' },
      { title: 'Personal Leave' }
    ],

    approvers: [],

    selectedApprover: null,

  };
},

created() {
  this.getUser();
  this.getUserLeaveApplication();
  this.getToday();
  this.getUserAttendance();
  this.startTypewriter();

  window.addEventListener('keydown', this.handleKey);

  if(localStorage.getItem('token') == "" || localStorage.getItem('token') == null){
    this.$router.push('/login')
  }

},

methods: {

  startTypewriter() {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;

    const type = () => {
      const currentPhrase = this.phrases[this.phraseIndex];
      
      if (!this.isDeleting) {
        if (this.typewriterIndex < currentPhrase.length) {
          this.displayText = currentPhrase.substring(0, this.typewriterIndex + 1);
          this.typewriterIndex++;
          this.typewriterTimer = setTimeout(type, typeSpeed);
        } else {
          this.typewriterTimer = setTimeout(() => {
            this.isDeleting = true;
            type();
          }, pauseBeforeDelete);
        }
      } else {
        if (this.typewriterIndex > 0) {
          this.displayText = currentPhrase.substring(0, this.typewriterIndex - 1);
          this.typewriterIndex--;
          this.typewriterTimer = setTimeout(type, deleteSpeed);
        } else {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
          this.typewriterTimer = setTimeout(type, pauseBeforeType);
        }
      }
    };

    type();
  },

  getToday() {
    const now = new Date();

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months =[
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' 
    ];

    const todayIs = `${days[now.getDay()-1]}, ${now.getDate()} ${months[now.getMonth()]}`;

    this.today = todayIs;

      return;
    },

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

  getTeam() {
    axios.get(`/v1/team/${this?.user?.department_name}`)
    .then((r) => {
        this.team = r.data;
        return r
    })
    .catch((e) => {
        return e
    });
  },

  getApprovers() {
    axios.get('/v1/approvers', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
    .then((r) => {
        this.approvers = r.data;
        return r
    })
    .catch((e) => {
        return e
    });
  },

  getEmployee() {
    axios.get(`/v1/employee/${this?.user?.employee_id}`)
    .then((r) => {
        this.employee = r.data;
        return r
    })
    .catch((e) => {
        return e
    });
  },

  getAttendance(startDate, endDate) {

    const query = this.attendance = {
      startDate: this.dateFormat(startDate),
      endDate: this.dateFormat(endDate)
    };

    axios.get(`/v1/attendance`, { params: { ...query }, headers:{Authorization: 'Bearer ' + localStorage.getItem('token')} })
    .then((r) => {
        this.attendance = r.data;
        return r
    })
    .catch((e) => {
        return e
    });

    this.attendanceCalendarDialog = false;

  },

  getUserAttendance() {

    this.loading = true;

    const query = this.attendance = {
      startDate: this.dateFormat(`2025-01-01`),
      endDate: this.dateFormat(`2025-12-31`)
    };

    axios.get(`/v1/attendance`, { params: { ...query }, headers:{Authorization: 'Bearer ' + localStorage.getItem('token')} } )
    .then((r) => {
        this.attendance = r.data;
        setTimeout(() => (this.loading = false), 1000)
        return r
    })
    .catch((e) => {
        return e
    });

    this.attendanceCalendarDialog = false;

  },

  getProfile() {
    axios.get(`/v1/profile/${this.user?.employee_id}`)
    .then((r) => {
        this.profile = r.data;
        return r
    })
    .catch((e) => {
        return e
    });
  },

  getUserLeaveApplication() {
    this.loading = true;
    axios.get('/v1/leave', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
      .then((r) => {
         this.leave = r.data;
         setTimeout(() => (this.loading = false), 1000)
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
         this.deleteDialog = this.timelineItems?.length === 1;
         this.leaveTrackDialog = true;
         return r
      })
      .catch((e) => {
         return e
      });
  },

  createLeaveApplication() {

    this.loading = true,

    this.leavePayload = {
      "employee_id": this.user?.employee_id,
      "department_name": this.user?.department_name,
      "start_date": this.startDate,
      "end_date": this.endDate,
      "leave_type": this.select,
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

      setTimeout(() => (this.loading = false), 1000)

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

  downloadLeaveApproval(id) {

    this.loading = true;

    axios.get(`/file/${id}`, { responseType: 'blob' })
    .then((r) => {
    const blob = r.data;
    const filename = `E-Leave.png`;
    FileSaver.saveAs(blob, filename);
    setTimeout(() => (this.loading = false), 1000)
    })
    .catch((e) => {
      return e
    });

  },

  updatePassword() {

    this.new_password = {
      "password": this.password
    }

    const payload = this.new_password;

    axios.patch(`/v1/user/${this.user?.employee_id}`, payload)
      .then(() => {
        this.logout();
        return;
      })
      .catch((e) => {
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

  openAttendanceCalendarDialog() {
    this.attendanceCalendarDialog = true;
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

  disableSend() {
    return !this.reason;
  },

  downloadLeave() {
    this.downloading = true;
    const leaveRecord = this.leave.map(leave => ({
      "Created At" : leave.created_at,
      "Employee ID" : leave.employee_id,
      "Leave Type" : leave.leave_type,
      "Start Date" : leave.start_date,
      "End Date" : leave.end_date,
      "Approver ID" : leave.approver_id,
      "Reason" : leave.reason,  
      "Status" : leave.status,
    }));
  
    const ws = XLSX.utils.json_to_sheet(leaveRecord);

    const wb = XLSX.utils.book_new();
      ws['!cols'] = [
          { wch: 20 }, // A
          { wch: 20 }, // B
          { wch: 20 }, // C
          { wch: 20 }, // D
          { wch: 20 }, // E
          { wch: 20 }, // F
          { wch: 30 }, // G
        ]
      XLSX.utils.book_append_sheet(wb, ws, 'Record');

      // Convert workbook to buffer (memory representation)
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      setTimeout(() => (this.downloading = false), 1000)

      // Simulate a click on a hidden anchor element to trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      link.download = `${this.user.employee_id}-E-Leave.xlsx`; // Set filename
      link.style.display = 'none'; // Hide the anchor element
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary URL object
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);

  },

  downloadAttendance() {
    this.downloading = true;
    const printAttendance = this.attendance.map(att => ({
      "Attendance Date" : att.Att_Date,
      "Scan In 1" : att.Fr_Time1,
      "Scan Out 1" : att.To_Time1,
      "Scan In 2" : att.Fr_Time2,
      "Scan Out 2" : att.To_Time2,
    }));
  
    const ws = XLSX.utils.json_to_sheet(printAttendance);

    const wb = XLSX.utils.book_new();
      ws['!cols'] = [
          { wch: 30 }, // A
          { wch: 20 }, // B
          { wch: 20 }, // C
          { wch: 20 }, // D
          { wch: 20 }, // E
        ]
      XLSX.utils.book_append_sheet(wb, ws, 'Record');

      // Convert workbook to buffer (memory representation)
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      setTimeout(() => (this.downloading = false), 1000)

      // Simulate a click on a hidden anchor element to trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      link.download = `${this.user.employee_id}-Attedance.xlsx`; // Set filename
      link.style.display = 'none'; // Hide the anchor element
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary URL object
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);

  },


  dateFormat (timetamp){

  const date = new Date(timetamp);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const formattedDate = `${year}-${month.toString()}-${day.toString()}`;

  return formattedDate;
  },

  getCurrentYearAndMonthFirst() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are zero-indexed, so add 1
  const firstDay = new Date(year, month - 1, 1);

  return `${year}-${month}-${firstDay}`;
  },

  getCurrentYearAndMonthLast() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are zero-indexed, so add 1
  const lastDay = new Date(year, month, 0);

  return `${year}-${month}-${lastDay}`;
  }

},

computed: {

  startHoursArray() {
    const arr = [];
    for (let i = 7; i < 16; i++) {
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

  endHoursArray() {
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

  startMinutesArray() {
    return [
            { text: '00', value: 0 },
            { text: '15', value: 15 },
            { text: '30', value: 30 },
            { text: '45', value: 45 }
           ];
  },

  endMinutesArray() {
    return [
      { text: '00', value: 0 },
      { text: '15', value: 15 },
      { text: '30', value: 30 },
      { text: '45', value: 45 },
   ];
  },

  disabledDates() {
  const today = new Date();

  today.setDate(today.getDate());

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const overmorrow = new Date(tomorrow);
  overmorrow.setDate(tomorrow.getDate() + 1);

  return [today, tomorrow, overmorrow];
  },

  minDate() {
    const startDate = new Date(this.startDate);
    startDate.setMinutes(startDate.getMinutes() + 15);
    return startDate;
  },

  startMinDate() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    return startDate;
  },

  endMinDate() {
    return this.startMinDate;
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
@import url('https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap');
@import url('href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,10');

.cursor {
  animation: blink 0.7s infinite;
  font-weight: 100;
}

.toolbar-divider {
  font-size: 1.5rem;
  margin: 0 8px;
  color: rgba(255, 255, 255, 0.7);
}

.toolbar-divider--full {
  width: 1px;
  height: 100%;
  margin: 0 12px;
  background: rgba(255, 255, 255, 0.4);
  align-self: stretch;
}

.logout-btn {
  text-transform: none;
  font-weight: 600;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.noto-sans {
  font-family: "Noto Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: 1000;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

.suse {
  font-family: "SUSE", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}

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
background-color: #678daf;
cursor: pointer;
}

tbody tr:active {
background-color: rgba(28, 119, 129, 0.43);
cursor: pointer;
}

tr:nth-child(even) {
background-color: #f2f2f2;
}

@keyframes fadeIn { 
  from { opacity: 0; } 
}

.attendance {
  animation: fadeIn 1s infinite alternate;
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
