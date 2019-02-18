<template>
  <div class="images">
    <div
      class="image"
      v-for="(image, index) in medium"
      :key="index"
    >
      <div @click="openImage(image.previewUrl)"><img
          class="img"
          :src="image.previewUrl"
        ></div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['medium'],
  methods: {
    openImage (url) {
      window.ipc.send('openURL', url)
    }
  }
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
  pointer-events: none;
}
</style>
