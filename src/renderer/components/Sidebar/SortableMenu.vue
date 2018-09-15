<template>
  <div class="sortablemenu">
    <Icon :to="{name:'home_timeline'}" icon="home_timeline"/>
    <Icon :to="{name:'local_timeline'}" icon="local_timeline"/>
  </div>
</template>

<script>
import Icon from './Icon'
export default {
  components: { Icon },
  methods: {}
}
</script>

<style scoped>
.sortablemenu {
  width: 40px;
  height: auto;
}
</style>
