<template>
    <div id="tasks">
        <my_header></my_header>
        <div class="options">
            <input class="option" type="text" v-model="search_query" @change="filter_table">
            <select v-if="role !== '2'" class="option" v-model="status_filter_by_type" @change="filter_table">
                <option value="0">Все типы задач</option>
                <option value="1">Другое</option>
                <option value="2">Лабораторные работы</option>
                <option value="3">Домашние задания</option>
            </select>
            <select v-if="role !== '2'" class="option" v-model="status_filter_by_status" @change="filter_table">
                <option value="0">Все статусы</option>
                <option value="1">Создано</option>
                <option value="2">В работе</option>
                <option value="3">Сделано</option>
                <option value="4">Все невыполненные задачи</option>
            </select>
        </div>
        <table class="table">
            <thead class="thead-light">
                <tr>
                    <th scope="col" v-if="role !== '2'"><input type="checkbox" v-model="allTasksAreChecked" @click="allTasksChecking"></th>
                    <th scope="col">Название</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Сделать до</th>
                    <th scope="col" v-if="role !== '2'">Статус</th>
                    <th scope="col" v-if="role === '2'">Группа</th>
                    <th scope="col">Тип</th>
                    <th scope="col" v-if="role !== '2'">Осталось дней</th>
                    <th scope="col">Cоздано</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasksForShow" :key="task.id">
                    <td v-if="role !== '2'"><input type="checkbox" v-model="task.isChecked" @change="checkForCheckBoxes"></td>
                    <td><router-link class="link" :to="{name: 'task', params:{id: task.id}}">{{task.name}}</router-link></td>
                    <td>{{task.description}}</td>
                    <td v-if="task.expiration_date instanceof Date">{{task.expiration_date.toLocaleDateString()}}</td>
                    <td v-if="role !== '2'">
                        <select name="example" v-model="task.id_status" @change="statusChanged(task)">
                            <option value="0" :selected="0===task.status">Создано</option>
                            <option value="1" :selected="1===task.status">В работе</option>
                            <option value="2" :selected="2===task.status">Сделано</option>
                        </select>
                    </td>
                    <td v-else-if="role === '2'">{{task.group}}</td>
                    <td>{{task.type}}</td>
                    <td v-if="role !== '2'">
                        <div v-if="Math.floor(task.expiration_date - Date.now())>=0">{{Math.floor((task.expiration_date - Date.now())/86400000)}}</div>
                        <div v-else>Время истекло</div>
                    </td>
                    <td v-if="task.creation_date instanceof Date">{{task.creation_date.toLocaleDateString()}}</td>
                </tr>
            </tbody>
        </table>
        <div class="status_btn" v-if="isSomeChecked"><button class="btn" @click="manyStatusesChange(1)">В работу</button> <button class="btn" @click="manyStatusesChange(2)">Сделано</button></div>
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
                search_query: "",
                status_filter_by_type: 0,
                status_filter_by_status: 4,
                tasks: [{}],
                allTasksAreChecked: false,
                isSomeChecked: false,
                tasksForShow: []
            }
        },
        methods:{
            async manyStatusesChange(id_status){
                for (let task of this.tasks) {
                    if (task.isChecked){
                        task.id_status = id_status;
                        await this.changeStatus(task);
                        task.isChecked = false;
                    }
                }
                this.$forceUpdate();
            },
            async task_load(){ // Метод загрузки задач
                if (this.username.length > 0 && this.pass.length > 0){ //Проверка на наличие в куках username и password
                    try {
                        await this.$http.get(`http://ip2020.std-982.ist.mospolytech.ru/tasks/${this.username}/${this.pass}`).then((res) => res.json()).then((res) => (this.tasks = res));
                        if (this.tasks === -1){
                            this.logout();
                        }
                        for (let task of this.tasks){ //преобразование даты из числа YYYYDDMM в дату
                            task.isChecked = false;
                            task.isSearchRes = true;
                            task.isTypeFilterRes = true;
                            task.isStatusRes = true;
                            let ed = task.expiration_date;
                            let cd = task.creation_date;
                            let year = Math.floor(ed / 10000);
                            task.expiration_date = new Date(year, Math.floor(task.expiration_date/100) - (year*100)-1, task.expiration_date % 100);
                            year = Math.floor(cd / 10000);
                            task.creation_date = new Date(year, Math.floor(task.creation_date/100) - (year*100)-1, task.creation_date % 100);
                        }
                        this.tasks.sort((a, b) => a.expiration_date > b.expiration_date ? 1 : -1);
                        this.filter_table();
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
                await this.changeStatus(task);
                this.$forceUpdate();
            },
            async changeStatus(task){
                let for_send = {
                    id: task.id,
                    id_status: task.id_status
                };
                try{
                await this.$http.put(`http://ip2020.std-982.ist.mospolytech.ru/status_change/${this.username}/${this.pass}`, for_send);
                }catch (e) {
                    console.log(e);
                    alert("Произошла ошибка сервера, повторите вход");
                    this.logout();
                }
            },
            allTasksChecking(){
                    for (let task of this.tasks){
                        task.isChecked = !this.allTasksAreChecked;
                    }
                    this.checkForCheckBoxes();

            },
            filter_table(){
                console.log("1");
                this.tasksForShow = [];
                console.log(this.tasks);
                for (let task of this.tasks){
                    if ((this.search_query === "" || task.name.includes(this.search_query) || task.description.includes(this.search_query)) &&
                        (this.role == 2 || this.status_filter_by_status == 0 || task.id_status === this.status_filter_by_status - 1 || (this.status_filter_by_status == 4 && (task.id_status === 0 || task.id_status === 1 ))) &&
                        (this.role == 2 || this.status_filter_by_type == 0 || task.id_type === this.status_filter_by_type - 1)) {
                        this.tasksForShow.push(task);

                    }
                }
            },
            checkForCheckBoxes(){
                this.isSomeChecked = this.tasks.some(arrVal => arrVal.isChecked === true);
                console.log(this.isSomeChecked);
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
    .option{
        height: 25px;
        float: right;
        margin: 2px 10px;
    }
    .options{
        background-color: #e9ecef;
        height: 29px;
        width: 100%;
    }
    .status_btn{
        bottom: 10px;
        right: 10px;
        position: fixed;
    }
    .btn{
        background: rgb(186, 102, 187);
        color: white;
    }
</style>