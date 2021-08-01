<template>
  <div class="images">
    <div
      v-for="(image, index) in medium"
      :key="index"
      class="image"
    >
      <div @click="openImage(image.previewUrl)">
        <img
          class="img"
          :src="image.previewUrl"
        >
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['medium'],
  methods: {
    openImage (imageUrl) {
      const currentPath = localStorage.getItem('currentPath')
      const fullUrl = `${currentPath}#/imagepreview/${encodeURIComponent(imageUrl)}`
      window.ipc.send(
        'newWindow',
        fullUrl,
        'imagePreview'
      )
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
.image {
  cursor: pointer;
}
.img {
  height: 80px;
  margin: 2px;
  border-radius: 2px;
  pointer-events: none;
}
</style>
