<template>
    <div id="tasks">
        <my_header></my_header>
        <table class="table">
            <thead class="thead-light">
                <tr>
                    <th scope="col">Название</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Сделать до</th>
                    <th scope="col" v-if="role !== '2'">Статус</th>
                    <th scope="col" v-if="role === '2'">Группа</th>
                    <th scope="col">Тип</th>
                    <th scope="col" v-if="role !== '2'">Осталось дней</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.id">
                    <td><router-link class="link" :to="{name: 'task', params:{id: task.id}}">{{task.name}}</router-link></td>
                    <td>{{task.description}}</td>
                    <td v-if="task.exp_date instanceof Date">{{task.exp_date.toLocaleDateString()}}</td>
                    <td v-if="role !== '2'">
                        <select name="example" v-model="task.status" @change="statusChanged(task)">
                            <option value="0" :selected="0===task.status">Создано</option>
                            <option value="1" :selected="1===task.status">В работе</option>
                            <option value="2" :selected="2===task.status">Сделано</option>
                        </select>
                    </td>
                    <td v-else-if="role === '2'">{{task.group}}</td>
                    <td v-if="task.type === 1">Лабораторная работа</td>
                    <td v-else-if="task.type === 2">Домашняя работа</td>
                    <td v-else>-</td>
                    <td v-if="role !== '2'">
                        <div v-if="Math.floor(task.exp_date - Date.now())>=0">{{Math.floor((task.exp_date - Date.now())/86400000)}}</div>
                        <div v-else>Время истекло</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import my_header from '@/components/my_header.vue';
    export default {
        name: "tasks",
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
                cookie: document.cookie,
                tasks: [{}]
            }
        },
        methods:{
            async task_load(){
                if (this.username.length > 0 && this.pass.length > 0){ //Проверка на наличие в куках username и password
                    try {
                        await this.$http.get(`http://localhost:5000/tasks/${this.username}/${this.pass}`).then((res) => res.json()).then((res) => (this.tasks = res));
                        if (this.tasks === -1){
                            this.logout();
                        }
                        for (let task of this.tasks){ //преобразование даты из числа YYYYDDMM в дату
                            let ed = task.exp_date;
                            let year = Math.floor(ed / 10000);
                            task.exp_date = new Date(year, Math.floor(task.exp_date/100) - (year*100)-1, task.exp_date % 100);
                        }
                    }catch (e) {
                        console.log(e);
                        alert("Сервер недоступен, попробуйте позже");
                        this.logout();
                    }
                }else
                    await this.$router.push('/login');
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
            async statusChanged(task){
                let for_send = {
                    id: task.id,
                    status: task.status
                };
                try{
                await this.$http.put(`http://localhost:5000/status_change/${this.username}/${this.pass}`, for_send);
                }catch (e) {
                    console.log(e);
                    alert("Произошла ошибка сервера, повторите вход");
                    this.logout();
                }
            }
        },
        created() {
            this.task_load();
        }
    }
</script>

<style scoped>
    .link{
        color: rgb(186, 102, 187);
    }
</style>