<template>
    <v-app>
      <v-card class="mx-auto mt-10" width="400">
        <img
          class="mx-auto center"
          height="150"
          lazy-src="https://raw.githubusercontent.com/skyhi-github/irap-web/2699c504e61248c05de49a991890415670b444af/src/assets/bowker-logo.svg"
          max-width="500"
          src="https://raw.githubusercontent.com/skyhi-github/irap-web/2699c504e61248c05de49a991890415670b444af/src/assets/bowker-logo.svg"
        />
        <v-card-title>
          <h1 style="text-align: center;">Login</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="employee_id"
            label="Employee ID"
            type="email"
            prepend-inner-icon="mdi-account"
            density="compact"
            outlined
          ></v-text-field>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            v-model="password"
            :type="visible ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-lock"
            density="compact"
            @click:append-inner="visible = !visible"
            outlined
            @keyup.enter="loginAction"
            clearable
          ></v-text-field>
          <v-btn color="primary" block rounded depressed @click="loginAction" :loading="loading">Login</v-btn>
          <br>
          <v-alert
      v-if="responseError"
      border="top"
      type="error"
      variant="outlined"
      prominent
    >
     <b> {{ message }} </b>
    </v-alert>
    <br>
          <v-divider><v-icon icon="mdi-shield-account"></v-icon></v-divider>
          <v-btn disabled prepend-icon="mdi-microsoft" color="white" block rounded depressed @click="register">Login With Microsoft</v-btn>
        </v-card-text>
      </v-card>
    </v-app>
  </template>
  
<script>

import axios from 'axios';

export default {
  name: 'Login',

  data() {
    return {
      employee_id: '',
      password: '',
      message: '',
      loading: false,
      visible: false,
      responseError: false,
      
    };
  },

  methods: {

      loginAction(){
        this.loading = true
        let payload = {
            employee_id: this.employee_id,
            password: this.password,
        }
        axios.post('/v1/auth/login', payload)
          .then(response => {
            localStorage.setItem('token', response.data.token)
            this.$router.push('/')
            return response
          })
          .catch(error => {
                this.loading = false
                this.responseError = true
                this.message = error.response.data.message
            return error
          });

      },

      register(){
          this.$router.push('/register')
      },

  },

  created() {
    if(localStorage.getItem('token') != "" && localStorage.getItem('token') != null){
        this.$router.push('/')
    }
  },
}
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
  