<template>
  <div class="timeline">
    <template v-if="active === 'status'">
      <TimeLine
        ref="timeline"
        :timeline="timeline"
        @wantOldToot="wantOldToot"
      />
    </template>
    <template v-if="active === 'following'">
      <UserList
        :infinite-mode="false"
        :users="following"
      />
    </template>
    <template v-if="active === 'followers'">
      <UserList
        :infinite-mode="false"
        :users="followers"
      />
    </template>
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
import UserList from '@/components/TimeLine/UserList'

export default {
  components: { TimeLine, UserList },
  props: ['timeline', 'active', 'followers', 'following'],
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
