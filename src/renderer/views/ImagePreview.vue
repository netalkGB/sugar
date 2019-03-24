<template>
  <div>
    <Preview :url="url"></Preview>
  </div>
</template>

<script>
import Preview from '@/components/ImagePreview/Preview'
export default {
  name: 'ImagePreview',
  props: ['url'],
  components: {
    Preview
  }
}
</script>

<style scoped>
</style>
