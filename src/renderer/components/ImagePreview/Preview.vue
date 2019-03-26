<template>
  <div :class="{center: zoom === 1.0}">
    <img
      class="image"
      :src="url"
      draggable="false"
      alt=""
      :style="{ 'height': autoHeight, 'width': autoWidth, 'zoom':zoom }"
    >
  </div>
</template>

<script>
export default {
  props: ['url', 'height'],
  data () {
    return {
      zoom: 1
    }
  },
  computed: {
    autoHeight () {
      return this.zoom === 1.0 ? this.height + 'px' : 'auto'
    },
    autoWidth () {
      return this.zoom === 1.0 ? '100%' : 'auto'
    }
  }
}
</script>

<style scoped>
.image {
  object-fit: contain;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
