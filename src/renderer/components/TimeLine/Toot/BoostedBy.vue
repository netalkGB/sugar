<template>
  <div>
    <MdRepeatIcon :w="'12'" :h="'12'" class="boosted" />{{boostedBy.displayName}}さんがブースト
  </div>
</template>

<script>
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'

export default {
  components: { MdRepeatIcon },
  props: ['boostedBy']
}
</script>

<style scope>
.boosted {
  color: #0000ff;
}
</style>
