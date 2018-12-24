<template>
  <div class="sortablemenu">
    <draggable
      v-model="menu"
      @start="drag=true"
      @end="drag=false"
    >
      <div
        v-for="item in menu"
        :key="item.icon"
      >
        <Icon
          :to="item.to"
          :icon="item.icon"
        />
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import logger from '@/other/Logger'
import Icon from '@/components/Sidebar/Icon'

export default {
  components: { Icon, draggable },
  props: ['items'],
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
  created () {
    this.merge()
  },
  methods: {
    merge () {
      const menu = this.menu
      let items = this.items
      if (!items) {
        return
      }
      for (let i of menu) {
        const r = this.items.find(item => item.icon === i.icon)
        if (!r) {
          items = [...items, r]
        }
      }
      this.menu = items
    }
  },
  watch: {
    menu (newVal) {
      this.$emit('onChanged', newVal)
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
