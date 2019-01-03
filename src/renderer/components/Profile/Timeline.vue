<template>
  <div class="timeline">
    <template v-if="active === 'status'">
      <TimeLine
        @wantOldToot="wantOldToot"
        :timeline="timeline"
        ref="timeline"
      />
    </template>
    <template v-if="active === 'following'">
      <div>{{following.length}}<br>{{following}}</div>
    </template>
    <template v-if="active === 'followers'">
      <div>{{followers.length}}<br>{{followers}}</div>
    </template>
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'

export default {
  props: ['timeline', 'active', 'followers', 'following'],
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
