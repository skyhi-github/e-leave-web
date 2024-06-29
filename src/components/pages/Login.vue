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
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            required
            density="compact"
            outlined
            clearable
          ></v-text-field>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            v-model="password"
            :type="visible ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            required
            density="compact"
            @click:append-inner="visible = !visible"
            outlined
            clearable
          ></v-text-field>
          <v-checkbox v-model="rememberMe" label="Remember Me" dark></v-checkbox>
          <v-btn color="primary" block rounded depressed @click="loginAction">Login</v-btn>
          <br>
          <v-btn color="success" block rounded depressed @click="register">Register</v-btn>
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
        email: '',
        password: '',
        rememberMe: false,
        visible: false,
      };
    },

    methods: {

      loginAction(){
        let payload = {
            email: this.email,
            password: this.password,
        }
        axios.post('/v1/auth/login', payload)
          .then(response => {
            localStorage.setItem('token', response.data.token)
            this.$router.push('/')
            return response
          })
          .catch(error => {
            this.isSubmitting = false
           if (error.response.data.errors != undefined) {
                this.validationErrors = error.response.data.errors
            }
            if (error.response.data.error != undefined) {
                this.validationErrors = error.response.data.error
            }
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
  