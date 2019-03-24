<template>
  <div>
    <img
      class="image"
      :src="url"
      draggable="false"
      alt=""
    >
  </div>
</template>

<script>
export default {
  props: ['url']
}
</script>

<style scoped>
.image {
  height: auto;
  width: 100%;
}
</style>
