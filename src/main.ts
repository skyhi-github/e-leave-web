import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/pages/Login.vue';
import Home from './components/pages/Home.vue';
import Register from './components/pages/Register.vue'
import axios from 'axios';

const app = createApp(App)
registerPlugins(app)

axios.defaults.baseURL = 'http://localhost:4000'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        { path: '/', component: Home},
        { path: '/login', component: Login},
        { path: '/register', component: Register},
    ]
});

app.use(router)

app.mount('#app')
