<template>
  <v-app>
    <router-view name="NavBar"></router-view>
    <v-content
      :class="{
        'content-bg': !['Watch'].includes(this.$route.name) ? true : false
      }"
    >
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.content-bg {
  background-color: #f9f9f9;
}
.card {
  background: #f9f9f9 !important;
}
</style>
