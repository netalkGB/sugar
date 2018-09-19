<template>
  <div>
    <MdRepeatIcon :w="'12'" :h="'12'" id="boosted" />nameさんがブースト
  </div>
</template>

<script>
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'

export default {
  components: { MdRepeatIcon }
}
</script>

<style scope>
#boosted {
  color: #0000ff;
}
</style>
