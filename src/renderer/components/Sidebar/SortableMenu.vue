<template>
  <div class="sortablemenu">
    <draggable v-model="menu" @start="drag=true" @end="drag=false">
      <div v-for="item in menu" :key="item.icon">
        <Icon :to="item.to" :icon="item.icon"/>
      </div>
    </draggable>
  </div>
</template>

<script>
import logger from '../../other/Logger'
import Icon from './Icon'
import draggable from 'vuedraggable'
export default {
  components: { Icon, draggable },
  data () {
    return {
      drag: false,
      menu: [
        { icon: 'home_timeline', to: { name: 'home_timeline' } },
        { icon: 'local_timeline', to: { name: 'local_timeline' } },
        { icon: 'public_timeline', to: { name: 'public_timeline' } },
        { icon: 'notifications', to: { name: 'notification' } }
      ]
    }
  },
  methods: {},
  watch: {
    menu (newVal) {
      logger.debug('menu', JSON.stringify(newVal))
    },
    drag (newVal) {
      logger.debug('newVal', newVal)
    }
  }
}
</script>

<style scoped>
.sortablemenu {
  width: 40px;
  height: auto;
}
</style>
