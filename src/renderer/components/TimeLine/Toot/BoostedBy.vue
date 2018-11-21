<template>
  <div class="container">
    <div class="icon">
      <MdRepeatIcon :w="'12'" :h="'12'" class="boosted" />
    </div>
    <div class="message">
      <NotificationName :profile="boostedBy" />さんがブースト
    </div>
  </div>
</template>

<script>
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'
import NotificationName from '@/components/TimeLine/Toot/NotificationName'

export default {
  components: { MdRepeatIcon, NotificationName },
  props: ['boostedBy']
}
</script>

<style scoped>
:root {
  --icon-size: 12px;
}
.container {
  display: flex;
}
.icon {
  width: var(--icon-size);
  height: 15px;
  display: flex;
  align-items: center;
}
.message {
  width: calc(100% - var(--icon-size));
}
.boosted {
  color: #0000ff;
}
</style>
