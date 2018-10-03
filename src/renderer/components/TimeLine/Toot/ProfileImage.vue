<template>
  <div class="profileImg">
    <img class="img" :src="profile.avatar">
  </div>
</template>

<script>
export default {
  props: ['profile']
}
</script>

<style scoped>
.profileImg {
  width: 40px;
  display: flex;
  justify-content: center;
}
.img {
  margin-top: 10px;
  width: 32px;
  height: 32px;
}
</style>
