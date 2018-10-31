<template>
  <div>
    <MdRepeatIcon :w="'12'" :h="'12'" class="boosted" />
    <NotificationName :profile="boostedBy" />さんがブースト
  </div>
</template>

<script>
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'
import NotificationName from './NotificationName'

export default {
  components: { MdRepeatIcon, NotificationName },
  props: ['boostedBy']
}
</script>

<style scope>
.boosted {
  color: #0000ff;
}
</style>
