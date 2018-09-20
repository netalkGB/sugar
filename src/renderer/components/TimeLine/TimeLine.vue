<template>
  <div class="timeline">
    <Toot v-for="(toot, index) in timeline" :toot="toot" :key="index"/>
  </div>
</template>

<script>
import Toot from './Toot/Toot'
export default {
  components: { Toot },
  props: ['timeline']
}
</script>

<style scoped>
.timeline {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
