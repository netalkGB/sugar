<template>
  <div>
    <IosStarIcon :w="'12'" :h="'12'" class="favorited" />
    <NotificationName :profile="favoritedBy" />さんがお気に入りに追加
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

<style scope>
.favorited {
  color: #ffaa00;
}
</style>
