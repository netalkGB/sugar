<template>
  <div :class="{center: zoom === 1.0}">
    <img
      class="image"
      :src="url"
      draggable="false"
      alt=""
      :style="{ 'height': autoHeight, 'width': autoWidth, 'zoom':zoom, 'transform': calcDeg }"
    >
    <div class="tool">
      <div @click="zoomIn">
        [+]
      </div>
      <div @click="zoomOut">
        [-]
      </div>
      <div @click="rotate">
        [r]
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['url', 'height'],
  data () {
    return {
      zoom: 1,
      rotateMode: 0
    }
  },
  computed: {
    autoHeight () {
      return this.zoom === 1.0 ? this.height + 'px' : 'auto'
    },
    autoWidth () {
      return this.zoom === 1.0 ? '100%' : 'auto'
    },
    calcDeg () {
      return `rotate(${this.rotateMode * 90}deg)`
    }
  },
  methods: {
    zoomIn () {
      this.zoom += 0.2
    },
    zoomOut () {
      this.zoom -= 0.2
    },
    rotate () {
      this.rotateMode = this.rotateMode >= 4 ? 0 : this.rotateMode + 1
    }
  }
}
</script>

<style scoped>
.image {
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
}
.tool {
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
}
</style>
