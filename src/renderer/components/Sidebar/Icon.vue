<template>
  <router-link :to="to">
    <MdHomeIcon v-if="icon === 'home_timeline'" :w="width" :h="height" id="icon"/>
    <IosPeopleIcon v-if="icon === 'local_timeline'" :w="width" :h="height" id="icon"/>
    <IosAddIcon v-if="icon === 'addTab'" :w="width" :h="height" id="icon" />
    <MdSettingsIcon v-if="icon === 'settings'" :w="width" :h="height" id="icon" />
  </router-link>

</template>

<script>
import MdHomeIcon from 'vue-ionicons/dist/md-home.vue'
import IosPeopleIcon from 'vue-ionicons/dist/ios-people.vue'
import IosAddIcon from 'vue-ionicons/dist/ios-add.vue'
import MdSettingsIcon from 'vue-ionicons/dist/md-settings.vue'
export default {
  props: ['to', 'icon'],
  components: { MdHomeIcon, IosPeopleIcon, IosAddIcon, MdSettingsIcon },
  data () {
    return {
      width: '26',
      height: '26'
    }
  }
}
</script>

<style scoped>
#icon {
  height: 48px;
  color: #888888;
  /* background-color: beige; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
