<template>
    <div id="about">
        <my_header></my_header>
        <h1>Ваш профиль</h1>
        <p><b>Вас зовут:</b> <input type="text" disabled v-model="user_name"></p>
        <p v-if="group !== 'null'"><b>Ваша группа:</b> {{group}}</p>
        <!-- В зависимости от ID роли выводим нужный статус-->
        <p v-if="role ==='0'">Вы - студент</p>
        <p v-if="role ==='1'">Вы - староста</p>
        <p v-if="role ==='2'">Вы - администратор</p>
        <p><button class="btn" @click="$router.push('/login_history')">История авторизаций</button></p>
    </div>
</template>

<script>
    import my_header from './my_header.vue';
    export default {
        name: "about",
        components:{
            my_header
        },
        data(){
            return{
                username: document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1"),
                pass: document.cookie.replace(/(?:(?:^|.*;\s*)pass=\s*([^;]*).*$)|^.*$/, "$1"),
                user_name: document.cookie.replace(/(?:(?:^|.*;\s*)name=\s*([^;]*).*$)|^.*$/, "$1"),
                group: document.cookie.replace(/(?:(?:^|.*;\s*)group=\s*([^;]*).*$)|^.*$/, "$1"),
                role: document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*([^;]*).*$)|^.*$/, "$1"),
            }
        }
    }
</script>

<style scoped>
    *{
        color: rgb(186, 102, 187);
        text-align: center;
    }
    .btn{
        color: white;
        background: rgb(186, 102, 187);;
    }
</style>