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
  props: ['isFollower', 'isFollowing']
}
</script>

<style>
</style>
