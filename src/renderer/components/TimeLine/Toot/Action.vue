<template>
  <div id="action">
    <div id="reply"><IosUndoIcon :w="'18'" :h="'18'" /> <div class="count">32</div></div>
    <div id="boost" class="boosted" ><MdRepeatIcon :w="'18'" :h="'18'" /><div class="count">50</div></div>
    <div id="protectedboost"><IosLockIcon :w="'18'" :h="'18'" /><div class="count"></div></div>
    <div id="dmboost"><IosMailIcon :w="'18'" :h="'18'" /><div class="count"></div></div>
    <div id="favorite" class="favorited"> <IosStarIcon :w="'18'" :h="'18'" /><div class="count">32</div></div>
  </div>
</template>

<script>
import IosUndoIcon from 'vue-ionicons/dist/ios-undo.vue'
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'
import IosStarIcon from 'vue-ionicons/dist/ios-star.vue'
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'
import IosMailIcon from 'vue-ionicons/dist/ios-mail.vue'

export default {
  components: { IosUndoIcon, MdRepeatIcon, IosStarIcon, IosLockIcon, IosMailIcon }
}
</script>

<style scoped>
#action {
  display: flex;
  flex-wrap: wrap;
  margin: 4px 0;
}
.favorited {
  color: #ffaa00;
}
.boosted {
  color: #0000ff;
}

#reply,
#boost,
#favorite,
#protectedboost,
#dmboost {
  display: flex;
  cursor: pointer;
  /* color: #bbbbbb; */
}
.count {
  width: 32px;
}
</style>
