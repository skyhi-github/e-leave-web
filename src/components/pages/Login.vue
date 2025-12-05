<template>
    <v-app>
      <v-card class="mx-auto mt-10" width="400">
        <img
          class="mx-auto center"
          height="150"
          lazy-src="/src/assets/bowker-logo.svg"
          max-width="500"
          src="/src/assets/bowker-logo.svg"
        />
        <img
          class="mx-auto center"
          height="80"
          lazy-src="/src/assets/bowker-logo.svg"
          max-width="500"
          src="/src/assets/OG.svg"
        />
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
          <v-divider><v-icon icon="mdi-account-plus"></v-icon></v-divider>
          <v-btn color="green-darken-3" block rounded depressed @click="register">Register</v-btn>
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
  