<template>
    <div id="login_history">
        <my_header></my_header>
        <table class="table">
            <thead class="thead-light">
                <tr>
                    <th>Дата и время авторизации</th>
                    <th>Платформа</th>
                    <th>Версия платформы</th>
                </tr>
            </thead>
        </table>
    </div>
</template>

<script>
    import my_header from './my_header.vue';
    export default {
        name: "login_history",
        components:{
            my_header
        }
    }
</script>

<style scoped>

</style>