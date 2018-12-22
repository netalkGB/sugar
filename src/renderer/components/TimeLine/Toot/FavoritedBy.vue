<template>
  <div
    class="container"
    @click="$emit('click')"
  >
    <div class="icon">
      <IosStarIcon
        :w="'12'"
        :h="'12'"
        class="favorited"
      />
    </div>
    <div class="message">
      <NotificationName :profile="favoritedBy" />さんがお気に入りに追加
    </div>
  </div>
</template>

<script>
import IosStarIcon from 'vue-ionicons/dist/ios-star.vue'
import NotificationName from './NotificationName'
export default {
  components: { IosStarIcon, NotificationName },
  props: ['favoritedBy']
}
</script>

<style scoped>
:root {
  --icon-size: 12px;
}
.container {
  display: flex;
  cursor: pointer;
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
.favorited {
  color: #ffaa00;
}
</style>
