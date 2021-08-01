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
      <UserList
        :infiniteMode="false"
        :users="following"
      />
    </template>
    <template v-if="active === 'followers'">
      <UserList
        :infiniteMode="false"
        :users="followers"
      />
    </template>
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
import UserList from '@/components/TimeLine/UserList'

export default {
  props: ['timeline', 'active', 'followers', 'following'],
  components: { TimeLine, UserList },
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
