<template>
  <div class="timeline">
    <Toot v-for="(item, index) in [null,null,null,null,null,null,null,null,null,null,null]" :key="index"/>
  </div>
</template>

<script>
import Toot from './Toot/Toot'
export default {
  components: { Toot }
}
</script>

<style scoped>
.timeline {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
