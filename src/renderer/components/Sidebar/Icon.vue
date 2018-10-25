<template>
  <router-link v-if="to !== undefined" :to="to">
    <MdHomeIcon v-if="icon === 'home_timeline'" :w="width" :h="height" class="icon" />
    <IosPeopleIcon v-if="icon === 'local_timeline'" :w="width" :h="height" class="icon" />
    <IosGlobeIcon v-if="icon === 'public_timeline'" :w="width" :h="height" class="icon" />
    <IosNotificationsIcon v-if="icon === 'notifications'" :w="width" :h="height" class="icon" />
    <IosAddIcon v-if="icon === 'addTab'" :w="width" :h="height" class="icon" />
    <MdSettingsIcon v-if="icon === 'settings'" :w="width" :h="height" class="icon" />
  </router-link>
  <div v-else>
    <IosMegaphoneIcon v-if="icon === 'toot'" :w="width" :h="height" class="icon" />
  </div>
</template>

<script>
import MdHomeIcon from 'vue-ionicons/dist/md-home.vue'
import IosPeopleIcon from 'vue-ionicons/dist/ios-people.vue'
import IosAddIcon from 'vue-ionicons/dist/ios-add.vue'
import IosGlobeIcon from 'vue-ionicons/dist/ios-globe.vue'
import MdSettingsIcon from 'vue-ionicons/dist/md-settings.vue'
import IosMegaphoneIcon from 'vue-ionicons/dist/ios-megaphone.vue'
import IosNotificationsIcon from 'vue-ionicons/dist/ios-notifications.vue'
export default {
  props: ['to', 'icon'],
  components: { MdHomeIcon, IosPeopleIcon, IosAddIcon, MdSettingsIcon, IosGlobeIcon, IosMegaphoneIcon, IosNotificationsIcon },
  data () {
    return {
      width: '26',
      height: '26'
    }
  }
}
</script>

<style scoped>
.icon {
  height: 48px;
  color: #888888;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
