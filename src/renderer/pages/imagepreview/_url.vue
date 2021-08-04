<template>
  <div :style="{ width: width - 8 + 'px', height: height -8 + 'px' }">
    <Preview :url="url" :height="height" />
  </div>
</template>

<script>
import Preview from '@/components/ImagePreview/Preview'
export default {
  name: 'ImagePreview',
  components: {
    Preview
  },
  props: [''],
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    url () {
      return String(this.$route.params.url)
    }
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (e) => {
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
