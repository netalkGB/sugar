<template>
  <div class="nameandid">
    <div
      v-if="profile.displayName"
      class="name clickable"
      @click="$emit('click')"
    >
      {{ profile.displayName }}
    </div>
    <div
      v-if="profile.locked"
      class="protect clickable"
      @click="$emit('click')"
    >
      <IosLockIcon
        :w="'12'"
        :h="'12'"
      />
    </div>
    <div
      class="id clickable"
      @click="$emit('click')"
    >
      {{ profile.userid }}
    </div>
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
.clickable {
  cursor: pointer;
}
</style>
