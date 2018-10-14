<template>
  <div v-if="files.length > 0">
    <div class="item" v-for="(file,idx) in files" :key="idx">
      <div @click="removeFile(idx)">x</div>
      <div>{{file}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['files'],
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
}
</style>
