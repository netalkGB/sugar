<template>
  <div class="images">
    <img class="image" v-for="(image, index) in medium" :key="index" :src="image.previewUrl">
  </div>
</template>

<script>
export default {
  props: ['medium']
}
</script>

<style scoped>
.images {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.image {
  max-width: calc(50% - 8px);
  padding-bottom: 4px;
  max-height: 80px;
}
</style>
