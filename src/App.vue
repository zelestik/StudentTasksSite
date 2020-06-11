<template>
  <div id="app">
    <!--В router-view будут помещаться страницы приложения-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  async created() { // При запуске переводим пользователя на страницу авторизации
    await this.$router.push('/login');
  }
}
</script>

<style>

</style>
