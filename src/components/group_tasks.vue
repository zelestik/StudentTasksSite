<template>
    <div id="group_tasks">
        <my_header></my_header>
        <table class="table">
            <thead class="thead-light">
            <tr>
                <th scope="col"><input type="checkbox" v-model="allTasksAreChecked" @click="allTasksChecking"></th>
                <th scope="col">Название</th>
                <th scope="col">Описание</th>
                <th scope="col">Сделать до</th>
                <th scope="col">Тип</th>
                <th scope="col">Осталось дней</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="task in tasks" :key="task.id">
                <td><input type="checkbox" v-model="task.isChecked" @change="checkForCheckBoxes"></td>
                <td><router-link class="link" :to="{name: 'task', params:{id: task.id}}">{{task.name}}</router-link></td>
                <td>{{task.description}}</td>
                <td v-if="task.expiration_date instanceof Date">{{task.expiration_date.toLocaleDateString()}}</td>
                <td>{{task.type}}</td>
                <td>
                    <div v-if="Math.floor(task.expiration_date - Date.now())>=0">{{Math.floor((task.expiration_date - Date.now())/86400000)}}</div>
                    <div v-else>Время истекло</div>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="status_btn" v-if="isSomeChecked"><button class="btn">В личные</button> <button class="btn">Отказаться</button></div>
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
                allTasksAreChecked: false,
                isSomeChecked: false,
                tasks: [{}]
            }
        },
        methods:{
            async task_load(){ // Метод загрузки задач
                if (this.username.length > 0 && this.pass.length > 0){ //Проверка на наличие в куках username и password
                    try {
                        await this.$http.get(`http://ip2020.std-982.ist.mospolytech.ru/group_tasks/${this.username}/${this.pass}`).then((res) => res.json()).then((res) => (this.tasks = res));
                        if (this.tasks === -1){
                            this.logout();
                        }
                        for (let task of this.tasks){ //преобразование даты из числа YYYYDDMM в дату
                            task.isChecked = false;
                            task.isSearchRes = true;
                            task.isTypeFilterRes = true;
                            task.isStatusRes = true;
                            let ed = task.expiration_date;
                            let year = Math.floor(ed / 10000);
                            task.expiration_date = new Date(year, Math.floor(task.expiration_date/100) - (year*100)-1, task.expiration_date % 100);
                        }
                        this.tasks.sort((a, b) => a.expiration_date > b.expiration_date ? 1 : -1);
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
            allTasksChecking(){
                for (let task of this.tasks){
                    task.isChecked = !this.allTasksAreChecked;
                }
                this.checkForCheckBoxes();

            },
            checkForCheckBoxes(){
                this.isSomeChecked = this.tasks.some(arrVal => arrVal.isChecked === true);
                console.log(this.isSomeChecked);
            }
        },
        async created() {
            if (this.role === null){
                await this.$router.push('/tasks');
            }
            this.task_load();
        }
    }
</script>

<style scoped>
    .link{
        color: rgb(186, 102, 187);
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