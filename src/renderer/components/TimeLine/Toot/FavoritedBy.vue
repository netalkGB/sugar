<template>
  <div>
    <IosStarIcon :w="'12'" :h="'12'" class="favorited" />{{favoritedBy.displayName}}さんがお気に入りに追加
  </div>
</template>

<script>
import IosStarIcon from 'vue-ionicons/dist/ios-star.vue'

export default {
  components: { IosStarIcon },
  props: ['favoritedBy']
}
</script>

<style scope>
.favorited {
  color: #ffaa00;
}
</style>
