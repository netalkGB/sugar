<template>
  <div class="images">
    <div class="image">
      <img class="img" v-for="(image, index) in medium" :key="index" :src="image.previewUrl">
    </div>
  </div>
</template>

<script>
export default {
  props: ['medium']
}
</script>

<style scoped>
.images {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.img {
  height: 80px;
  margin: 2px;
  border-radius: 2px;
}
</style>
