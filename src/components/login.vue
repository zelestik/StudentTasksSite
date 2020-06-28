<template>
    <div class="form" id="login">
        <h1><b class="label">Добро пожаловать!</b></h1>
        <p><b class="label">Username</b></p>
        <p><input class="input_form" type="text" maxlength="32" v-model="username"></p>
        <p><b class="label">Password</b></p>
        <p><input class="input_form" type="password" maxlength="32" v-model="pass"></p>
        <p><button class="btn btn-light" @click="login">Войти</button></p>
    </div>
</template>

<script>

    export default {
        name: "login",
        data() {
            return {
                username: "",
                pass: "",
                version: "1.0",
                user:{}
            }
        },
        components:{

        },
        methods:{
            async login(){ // По нажатию на кнопку "Войти"
                if (this.username.length > 0 && this.pass.length > 0){// Проверяем, чтобы поля логина и пароля не были пустыми
                    try{
                        await this.$http.get(`http://ip2020.std-982.ist.mospolytech.ru/login/${this.username}/${this.pass}/Web/${this.version}`).then((res)=>res.json()).then((res)=> (this.user=res));
                        if (this.user !== -1 && this.user !== null) { // Если вход успешен, записываем пользователя в cookie
                            document.cookie = `username=${this.username}`;
                            document.cookie = `pass=${this.pass}`;
                            document.cookie = `name=${this.user.name}`;
                            document.cookie = `group=${this.user.group}`;
                            document.cookie = `role=${this.user.role}`;
                            await this.$router.push('/tasks');
                        }else{
                            alert("Неверный логин и/или пароль")
                        }
                    }catch (e) {
                        console.log(e);
                        alert("Сервер недоступен, попробуйте позже");
                    }
                }else
                        alert("Поля username и password не могут быть пустыми");
            }
        },
        async created(){
            // При открытии смотрим куки. При наличии логина и пароля - пытаемся авторизоваться
            let username = document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1");
            let password = document.cookie.replace(/(?:(?:^|.*;\s*)pass=\s*([^;]*).*$)|^.*$/, "$1");
            if (username !== "" && password !== "")
                await this.$router.push('/tasks');

        }
    }
</script>

<style scoped>
    *{
        text-align: center;
    }
    .form{
        height: 100vh;
        background-image: linear-gradient(to top right, rgb(101, 115, 255), rgb(111, 114, 241), rgb(120, 113, 228), rgb(130, 113, 214), rgb(140, 112, 201), rgb(149, 111, 187), rgb(159, 110, 174), rgb(168, 109, 160), rgb(178, 108, 147), rgb(188, 108, 133), rgb(197, 107, 120), rgb(207, 106, 106));
    }
    .label{
        color: white;
    }
    .btn{
        color: rgb(186, 102, 187);
    }
    .input_form{
        color: rgb(186, 102, 187);
    }
</style>