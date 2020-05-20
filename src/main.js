import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from "vue-router"
import login from "@/components/login";
import tasks from "@/components/tasks";
import task from "@/components/task";
import about from "@/components/about";
import new_task from "@/components/new_task";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes:[
    {path: '/login', component: login},
    {path: '/tasks', component: tasks},
    {path: '/task/:id', name: 'task', component: task},
    {path: '/new_task', component: new_task},
    {path: '/about', component: about}
  ]
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
