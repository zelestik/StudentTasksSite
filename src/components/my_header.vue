<template>
    <div id="header">
        <b-navbar toggleable="lg" type="dark" variant="info" class="my-header">
            <b-navbar-brand>Здравствуй, <b>{{user_name}}</b></b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item><router-link class="link" to="/tasks"><b>Задачи</b></router-link></b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav v-if="group !== 'null'">
                    <b-nav-item><router-link class="link" to="/group_tasks"><b>Задачи группы</b></router-link></b-nav-item>
                </b-navbar-nav>
                <!-- Элементы выравненные по правому краю -->
                <b-navbar-nav class="ml-auto">
                    <b-navbar-nav right>
                        <b-nav-item v-if="role !== '2'"><router-link class="link" to="/new_task"><b>Создать задачу</b></router-link></b-nav-item>
                    </b-navbar-nav>
                    <b-nav-item-dropdown right>
                        <template v-slot:button-content><b>Аккаунт</b></template>
                        <b-dropdown-item><router-link class="link-account" to="/about">Профиль</router-link></b-dropdown-item>
                        <b-dropdown-item @click="logout">Выйти</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
    export default {
        name: "header",
        data(){
            return{
                user_name: document.cookie.replace(/(?:(?:^|.*;\s*)name=\s*([^;]*).*$)|^.*$/, "$1"),
                group: document.cookie.replace(/(?:(?:^|.*;\s*)group=\s*([^;]*).*$)|^.*$/, "$1"),
                role: document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*([^;]*).*$)|^.*$/, "$1")
            }
        },
        methods:{
            async logout(){
                //"Удаляем" куки и отправляем на страницу входа
                let cookies = document.cookie.split(";");
                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i];
                    let eqPos = cookie.indexOf("=");
                    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
                await this.$router.push('/login');
            }
        },
        async created(){
            // Если в куках нет логина и пароля. Отправляем на страницу авторизации
            if (!(document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1").length>0 && document.cookie.replace(/(?:(?:^|.*;\s*)pass=\s*([^;]*).*$)|^.*$/, "$1").length>0))
                await this.$router.push('/login');
        }
    }
</script>

<style scoped>
    .logout{
        color: red;
    }
    .link{
        color: white;
    }
    .link-account{
        color: gray;
    }
    .my-header{
        background-image: linear-gradient(to right, rgb(169, 99, 255), rgb(172, 100, 241), rgb(176, 100, 228), rgb(179, 101, 214), rgb(183, 102, 201), rgb(186, 102, 187), rgb(190, 103, 174), rgb(193, 103, 160), rgb(197, 104, 147), rgb(200, 105, 133), rgb(204, 105, 120), rgb(207, 106, 106));    }
</style>