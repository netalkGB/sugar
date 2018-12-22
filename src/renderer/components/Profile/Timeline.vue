<template>
  <div class="timeline">
    <TimeLine :infiniteMode="false" :timeline="timeline" />
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
export default {
  props: ['timeline'],
  components: { TimeLine }
}
</script>

<style scoped>
</style>
