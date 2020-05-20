<template>
    <div id="new_task">
        <my_header></my_header>
        <h1>Новая задача</h1>
        <p><b>Название</b></p>
        <input type="text" v-model="task.name">
        <p><b>Описание</b></p>
        <input type="text" v-model="task.description">
        <p><b>Сделать до</b></p>
        <input type="date" v-model="task.exp_date">
        <p><b>Тип</b></p>
        <select name="example" v-model="task.type">
            <option value="1">Лабораторная работа</option>
            <option value="2">Домашняя работа</option>
            <option value="0">Другое</option>
        </select>
        <p><label v-if="role === '1'"><input type="checkbox" v-model="for_group">Групповая задача</label></p>
        <p><button class="btn" @click="add_task()">Добавить задачу</button></p>
    </div>
</template>

<script>
    import my_header from "@/components/my_header";

    export default {
        name: "new_task",
        components:{
            my_header
        },
        data(){
            return{
                task:{
                  name: "",
                  description: "",
                  exp_date: new Date(),
                  type: 0
                },
                for_group: false,
                username: document.cookie.replace(/(?:(?:^|.*;\s*)username=\s*\s*([^;]*).*$)|^.*$/, "$1"),
                pass: document.cookie.replace(/(?:(?:^|.*;\s*)pass=\s*([^;]*).*$)|^.*$/, "$1"),
                user_name: document.cookie.replace(/(?:(?:^|.*;\s*)name=\s*([^;]*).*$)|^.*$/, "$1"),
                group: document.cookie.replace(/(?:(?:^|.*;\s*)group=\s*([^;]*).*$)|^.*$/, "$1"),
                role: document.cookie.replace(/(?:(?:^|.*;\s*)role=\s*([^;]*).*$)|^.*$/, "$1"),
                answer: {}
            }
        },
        methods:{
            async add_task(){
                if (!(this.for_group)) {
                    if (this.task.name !== "") {
                        try {
                            await this.$http.post(`http://localhost:5000/post_tasks/${this.username}/${this.pass}`, this.task).then((res) => (this.answer = res));
                            if (this.answer.bodyText === "0") {
                                alert("Успешно");
                                await this.$router.push('/tasks');
                            }else if (this.answer.bodyText === "-1" || this.answer.bodyText === "-2"){
                                alert("Произошла ошибка сервера, повторите вход");
                                console.log(this.answer);
                                this.logout();
                            }else{
                                alert("Произошла неизвестная ошибка сервера, повторите вход");
                                console.log(this.answer);
                                this.logout();
                            }
                        }catch (e) {
                            alert("Произошла ошибка сервера, повторите вход");
                            console.log(e);
                            this.logout();
                        }
                    }
                }
            },
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
            },
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