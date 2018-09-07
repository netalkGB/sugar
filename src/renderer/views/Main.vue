<template>
  <div>
    userId:{{userId}}
    <router-link :to="{name:'home_timeline'}">home_timeline</router-link>
    <router-link :to="{name:'local_timeline'}">local_timeline</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: { userId: Number }
}
</script>

<style>
</style>
