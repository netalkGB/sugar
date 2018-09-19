<template>
  <div id="nameandid">
    <div id="name">name</div>
    <div id="protect"><IosLockIcon :w="'12'" :h="'12'" /></div>
    <div id="id">@screen_name@example.com</div>
  </div>
</template>

<script>
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'

export default {
  components: { IosLockIcon }
}
</script>

<style scoped>
#nameandid {
  display: flex;
  width: calc(100% - 20px);
  margin-right: 4px;
}
#name {
  font-weight: bolder;
  margin-right: 3px;
}
#protect {
  width: 16px;
}
#id {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
