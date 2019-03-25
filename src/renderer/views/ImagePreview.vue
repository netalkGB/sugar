<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Preview :url="url" :height="height"></Preview>
  </div>
</template>

<script>
import Preview from '@/components/ImagePreview/Preview'
export default {
  name: 'ImagePreview',
  props: ['url'],
  components: {
    Preview
  },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', e => {
      this.width = window.innerWidth
      this.height = window.innerHeight
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  }
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
  background: #000;
}
</style>
