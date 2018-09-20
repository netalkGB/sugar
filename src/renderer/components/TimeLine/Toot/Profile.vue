<template>
  <div id="nameandid">
    <div id="name" v-if="profile.displayName">{{profile.displayName}}</div>
    <div id="protect" v-if="profile.locked"><IosLockIcon :w="'12'" :h="'12'" /></div>
    <div id="id">{{profile.userid}}</div>
  </div>
</template>

<script>
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'

export default {
  components: { IosLockIcon },
  props: ['profile']
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
