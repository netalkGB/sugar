<template>
  <div class="countContainer">
    <div
      class="status"
      @click="$emit('toggle')"
    >
      <div class="title">トゥート</div>
      <div class="count">{{toot}}</div>
    </div>
    <div class="following">
      <div class="title">フォロー</div>
      <div class="count">{{following}}</div>
    </div>
    <div class="followers">
      <div class="title">フォロワー</div>
      <div class="count">{{follower}}</div>
    </div>
    <div class="other"></div>
  </div>
</template>

<script>
export default {
  props: ['follower', 'following', 'toot']
}
</script>

<style scoped>
.countContainer {
  display: grid;
  grid-template:
    "statuse following follower other" 30px
    / 70px 70px 70px 1fr;
  padding-bottom: 2px;
  padding-top: 2px;
}
.count {
  align-items: center;
  padding-left: 2px;
}
.title {
  font-size: 70%;
}
.status {
  cursor: pointer;
}
</style>
