<template>
  <v-app>
    <v-card class="mx-auto mt-10" width="400">
      <v-card-title>
          <h1 style="text-align: center;">
            <v-btn
              icon="mdi-arrow-left-thick"
              size="large"
              color="#E5E5E5"
              style="float: left;"
              @click="loginAction"/>
              Register
            <v-btn
              :loading="loading"
              icon="mdi-arrow-right-thick"
              size="large"
              style="float: right;"
              :disabled="!re_password"
              @click="register"/>
          </h1>
      </v-card-title>
      <v-card-text>
        <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: Sky"
                              label="First Name"
                              v-model="first_name"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: High"
                              label="Last Name"
                              v-model="last_name"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: IT Support"
                              label="Position"
                              v-model="position_name"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: MIS"
                              label="Department"
                              v-model="department_name"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: 6480"
                              label="Employee ID"
                              v-model="employee_id"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              hint="Example: 6120"
                              label="Manager ID"
                              v-model="manager_id"
                              variant="outlined"
                              :rules="[required]"
                              clearable
                            ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12">
                          <v-text-field
                            v-model="email"
                            hint="hongtha@bowerker.com"
                            label="Email"
                            variant="outlined"
                            :rules="[required]"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12">
                          <v-text-field
                            v-model="password"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'"
                            hint="T#$$#@(-)"
                            label="Password"
                            variant="outlined"
                            :rules="[password ? required : []]"
                            @click:append-inner="visible = !visible"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12">
                          <v-text-field
                            v-model="re_password"
                            v-if="password"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'"
                            :hint="hint"
                            label="Confirmation Password"
                            variant="outlined"
                            :rules="[password ? confirmationPassword : []]"
                            @click:append-inner="visible = !visible"
                            clearable
                          ></v-text-field>
                        </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>

import axios from 'axios';


export default {
  name: 'Register',

  data() {
    return {
      first_name: '',
      last_name: '',
      position_name: '',
      department_name: '',
      employee_id: '',
      manager_id: '',
      email: '',
      password: '',
      re_password: '',

      loading: false,
      visible: false,

    };
  },

  methods: {

    loginAction(){
          this.$router.push('/login')
   },

    register(){

      this.loading = true

      setTimeout(() => (this.loading = false), 1000)

      let payload = {

        first_name: this.first_name,
        last_name: this.last_name,
        position_name: this.position_name,
        department_name: this.department_name,
        employee_id: this.employee_id,
        manager_id: this.manager_id,
        email: this.email,
        password: this.password

      }

      const hasNullValue = Object.values(payload).some(value => value === null);

      if (!hasNullValue) {
        axios.post('/v1/auth/register', payload)
          .then(response => {
      
            return response
          })
          .catch(error => {

           if (error.response.data.errors != undefined) {
                this.validationErrors = error.response.data.errors
            }
           if (error.response.data.error != undefined) {
              this.validationErrors = error.response.data.error
            }
            return error
          });
      } else {
        console.log("Payload is invalid: at least one key has a null value.");
      }

   },

   required (v) {
        return !!v || 'Field is required'
   },

   confirmationPassword (v) {

      if (v != this.password) {
        return 'Password is not match'
      }
   },

  },
};
</script>

<style scoped>
  .v-card {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  }
</style>
