<template>
  <v-dialog v-model="visible" transition="dialog-top-transition">

    <v-card
      class="mx-auto"
      elevation="16"
      width="31.25rem"
      title="Create Leave Application"
    >
      <template v-slot:append>
        <v-btn icon="$close" variant="text" @click="close"></v-btn>
      </template>

      <v-divider></v-divider>

      <div class="py-12 text-center">

        <v-form @keyup.esc="close" @keyup.enter="onCreate">
          <v-container>

            <v-card-title style="margin-top: -4.375rem;" class="text-h6 "></v-card-title>

            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectLocal"
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

              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedApproverLocal"
                  :items="approvers"
                  item-title="name"
                  item-value="employee_id"
                  label="Select Approver"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-check"
                  :disabled="!selectLocal"
                ></v-select>
              </v-col>

            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <VueDatePicker v-model="startDateLocal"
                  :disabled-dates="disabledDates"
                  :min-date="new Date()"
                  :start-date="startMinDate"
                  :start-time="{ hours: 7, minutes: 0 }"
                  text-input
                  teleport-center
                  placeholder="From Date"
                  input-class-name="dp-custom-input-range"
                  :disabled-week-days="[7, 0]"
                  @cleared="onClearDuration"
                  :is-24="false"
                  :disabled="!selectLocal"
                  time-picker-outline
                >
                  <template #time-picker="{ time, updateTime }">
                    <div class="custom-time-picker-component">
                      <select class="select-input" :value="time.hours" @change="updateTime(+$event.target.value) ">
                        <option v-for="h in startHoursArray" :key="h.value" :value="h.value">{{ h.text }}</option>
                      </select>
                      <select class="select-input" :value="time.minutes" @change="updateTime(+$event.target.value, false)">
                        <option v-for="m in startMinutesArray" :key="m.value" :value="m.value">{{ m.text }}</option>
                      </select>
                    </div>
                  </template>
                </VueDatePicker>
              </v-col>

              <v-col cols="12" sm="6">
                <VueDatePicker v-model="endDateLocal"
                  :disabled-dates="disabledDates"
                  :min-date="minDate"
                  :start-date="endMinDate"
                  :start-time="{ hours: 16, minutes: 0 }"
                  text-input
                  teleport-center
                  placeholder="End Date"
                  input-class-name="dp-custom-input-range"
                  :disabled-week-days="[7, 0]"
                  @cleared="onClearDuration"
                  :is-24="false"
                  :disabled="!startDateLocal"
                  time-picker-outline
                >
                  <template #time-picker="{ time, updateTime }">
                    <div class="custom-time-picker-component">
                      <select class="select-input" :value="time.hours" @change="updateTime($event.target.value)">
                        <option v-for="h in endHoursArray" :disabled="h.value === 7 ? time.minutes === 0 : false" :key="h.value" :value="h.value">{{ h.text }}</option>
                      </select>
                      <select class="select-input" :value="time.minutes" @change="updateTime(+$event.target.value, false)">
                        <option v-for="m in endMinutesArray" :disabled="m.value === 0 ? time.hours === 7 : false" :key="m.value" :value="m.value">{{ m.text }}</option>
                      </select>
                    </div>
                  </template>
                </VueDatePicker>
              </v-col>

            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="reasonLocal"
                  hint="Tell us your leave reason"
                  label="Reason"
                  variant="filled"
                  clearable
                  maxlength=100
                  counter
                  :disabled="!endDateLocal"
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
          @click="onCreate"
          :disabled="!reasonLocal"
        >
          Send
        </v-btn>
      </div>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  name: 'ApplyLeaveDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    leaveTypes: { type: Array, default: () => [] },
    approvers: { type: Array, default: () => [] },
    select: { default: null },
    selectedApprover: { default: null },
    startDate: { default: null },
    endDate: { default: null },
    disabledDates: { type: Array, default: () => [] },
    startMinDate: { default: null },
    loading: { type: Boolean, default: false },
    reason: { default: null },
    startHoursArray: { type: Array, default: () => [] },
    startMinutesArray: { type: Array, default: () => [] },
    endHoursArray: { type: Array, default: () => [] },
    endMinutesArray: { type: Array, default: () => [] },
    minDate: { default: null },
    endMinDate: { default: null },
  },
  emits: [
    'update:modelValue',
    'update:select',
    'update:selectedApprover',
    'update:startDate',
    'update:endDate',
    'update:reason',
    'create',
    'clearDuration'
  ],
  computed: {
    visible: {
      get() { return this.modelValue; },
      set(v) { this.$emit('update:modelValue', v); }
    },
    selectLocal: {
      get() { return this.select; },
      set(v) { this.$emit('update:select', v); }
    },
    selectedApproverLocal: {
      get() { return this.selectedApprover; },
      set(v) { this.$emit('update:selectedApprover', v); }
    },
    startDateLocal: {
      get() { return this.startDate; },
      set(v) { this.$emit('update:startDate', v); }
    },
    endDateLocal: {
      get() { return this.endDate; },
      set(v) { this.$emit('update:endDate', v); }
    },
    reasonLocal: {
      get() { return this.reason; },
      set(v) { this.$emit('update:reason', v); }
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
    onCreate() {
      this.$emit('create');
    },
    onClearDuration() {
      this.$emit('clearDuration');
    }
  }
}
</script>

<style scoped>
.custom-time-picker-component { display:flex; gap:8px }
.select-input { padding:6px }
</style>
