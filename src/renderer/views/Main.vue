<template>
  <div id="main" ref="main" :style="{ width: width + 'px', height: height + 'px' }">
    <div id="menu">
      <router-link :to="{name:'home_timeline'}">htl</router-link>
      <br>
      <router-link :to="{name:'local_timeline'}">ltl</router-link>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import logger from '../other/Logger'

export default {
  props: { userId: Number },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (e) => {
      this.width = window.innerWidth
      this.height = window.innerHeight
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize')
  }
}
</script>

<style scoped>
#main {
  display: flex;
  background-color: gainsboro;
}
</style>
