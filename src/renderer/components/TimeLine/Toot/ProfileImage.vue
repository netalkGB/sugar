<template>
  <div class="profileImg">
    <div class="image" @click="$emit('click')">
      <img
        class="img"
        :src="profile.avatar"
      >
    </div>
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
.image {
  cursor: pointer;
}
.img {
  margin-top: 10px;
  width: 32px;
  height: 32px;
  border-radius: 2px;
  pointer-events: none;
}
</style>
