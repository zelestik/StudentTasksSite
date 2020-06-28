import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from "vue-router"
import login from "@/components/login";
import tasks from "@/components/tasks";
import task from "@/components/task";
import about from "@/components/about";
import new_task from "@/components/new_task";
import login_history from "@/components/login_history";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import group_tasks from "@/components/group_tasks";

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Роутер Vue, отвечает за переключение страниц
const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes:[
    {path: '/login', component: login},
    {path: '/tasks', component: tasks},
    {path: '/task/:id', name: 'task', component: task},
    {path: '/new_task', component: new_task},
    {path: '/about', component: about},
    {path: '/group_tasks', component: group_tasks},
    {path: '/login_history', component: login_history}
  ]
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
