<template>
  <div class="timeline">
    <template v-if="active === 'status'">
      <TimeLine
        ref="timeline"
        :timeline="timeline"
        :first-load-done="firstTimelineLoadDone"
        @wantOldToot="wantOldToot"
      />
    </template>
    <template v-if="active === 'following'">
      <UserList
        :infinite-mode="false"
        :users="following"
        :first-load-done="firstFollowingLoadDone"
      />
    </template>
    <template v-if="active === 'followers'">
      <UserList
        :infinite-mode="false"
        :users="followers"
        :first-load-done="firstFollowersLoadDone"
      />
    </template>
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
import UserList from '@/components/TimeLine/UserList'

export default {
  components: { TimeLine, UserList },
  props: {
    timeline: {
      type: Array,
      required: true
    },
    active: {
      type: String,
      default: 'status'
    },
    followers: {
      type: Array,
      required: true
    },
    following: {
      type: Array,
      required: true
    },
    firstTimelineLoadDone: {
      type: Boolean,
      default: false
    },
    firstFollowersLoadDone: {
      type: Boolean,
      default: false
    },
    firstFollowingLoadDone: {
      type: Boolean,
      default: false
    }
  },
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
