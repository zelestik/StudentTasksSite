<template>
    <div id="task">
        <my_header></my_header>
    </div>
</template>

<script>
    import my_header from "@/components/my_header";
    export default {
        name: "task",
        components:{
            my_header
        },
        created(){ // Пока что механизм детального отображения задачи не реализован
            this.myID = this.$route.params.id;
        }
    }
</script>

<style scoped>

</style>