<template>
  <div>
    <div v-if="isFollower === true&& isFollowing === true">
      [相互フォロー中]
    </div>
    <div v-else-if="isFollower === true">
      [フォローされています]
    </div>
    <div v-else-if="isFollowing === true">
      [フォロー中]
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFollower: {
      type: Boolean,
      default: false
    },
    isFollowing: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
