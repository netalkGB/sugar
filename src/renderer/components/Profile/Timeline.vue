<template>
  <div class="timeline">
    <TimeLine
      @wantOldToot="wantOldToot"
      :timeline="timeline"
      ref="timeline"
    />
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
export default {
  props: ['timeline'],
  components: { TimeLine },
  methods: {
    wantOldToot (args) {
      const { maxID } = args
      this.$emit('wantOldToot', maxID)
    },
    loadOldTootDone () {
      this.$refs.timeline.$emit('loadOldTootDone', true)
    }
  }
}
</script>

<style scoped>
</style>
