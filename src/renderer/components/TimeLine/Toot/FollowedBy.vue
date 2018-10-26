<template>
  <div>
    <MdPersonAddIcon :w="'12'" :h="'12'" class="followedBy" />フォローされました
  </div>
</template>

<script>
import MdPersonAddIcon from 'vue-ionicons/dist/md-person-add.vue'

export default {
  components: { MdPersonAddIcon },
  props: ['followedBy']
}
</script>

<style scope>
.followedBy {
  color: #0000ff;
}
</style>
