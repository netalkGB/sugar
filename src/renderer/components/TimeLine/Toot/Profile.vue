<template>
  <div class="nameandid" @click="$emit('click')">
    <div class="name" v-if="profile.displayName">{{profile.displayName}}</div>
    <div class="protect" v-if="profile.locked">
      <IosLockIcon :w="'12'" :h="'12'" />
    </div>
    <div class="id">{{profile.userid}}</div>
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
.nameandid {
  display: flex;
}
.name {
  font-weight: bolder;
  margin-right: 3px;
}
.protect {
  width: 16px;
}
.id {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
