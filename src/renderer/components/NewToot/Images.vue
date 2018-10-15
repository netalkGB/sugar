<template>
  <div class="item" v-if="files.length > 0">
    <ImagePreview class="preview" v-for="(file,idx) in files" :file="file" :idx="idx" :key="idx" @remove="removeFile" />
  </div>
</template>

<script>
import ImagePreview from './ImagePreview'

export default {
  props: ['files'],
  components: {
    ImagePreview
  },
  methods: {
    removeFile (idx) {
      this.$emit('removeFile', idx)
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  overflow-y: auto;
}
.preview {
  margin-right: 4px;
}
</style>
