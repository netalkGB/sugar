<template>
  <div v-if="files.length > 0" class="images">
    <ImagePreview
      v-for="(file,idx) in files"
      :key="idx"
      class="preview"
      :file="file"
      :idx="idx"
      @remove="removeFile"
    />
  </div>
</template>

<script>
import ImagePreview from '@/components/NewToot/ImagePreview'

export default {
  components: {
    ImagePreview
  },
  props: ['files'],
  methods: {
    removeFile (idx) {
      this.$emit('removeFile', idx)
    }
  }
}
</script>

<style scoped>
.images {
  display: flex;
  overflow-y: auto;
}
.preview {
  margin-right: 4px;
}
</style>
