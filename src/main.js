import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Task from './components/Task.vue'
import Hello from './components/Hello.vue'
import TaskEditing from "./components/TaskEditing.vue";
import Registration from "./components/Registration.vue";
import Authorization from "./components/Authorization.vue";

Vue.use(Router);

const router = new Router({
 routes: [
   {
     path: '/home',
     name:'home',
     component: Hello,
   },
   {
     path: '/task/:id',
     name:'task',
     component: Task,
     props: true,
   },
    {
         path: '/edit_task/:id',
        name: 'edit_task',
        component: TaskEditing,
        props: true,
    },
     {
         path: '/registration',
         name: 'registration',
         component: Registration
     },
     {
         path: '/authorization',
         name: 'authorization',
         component: Authorization
     },
 ]
});

new Vue({
 el: '#app',
 render: h => h(App),
 router
});