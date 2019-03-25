<template>
  <div class="preview">
    <img
      class="image"
      :src="url"
      draggable="false"
      alt=""
      :style="{ height: height + 'px' }"
    >
  </div>
</template>

<script>
export default {
  props: ['url', 'height']
}
</script>

<style scoped>
.image {
  height: auto;
  height: 100%;
}
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
