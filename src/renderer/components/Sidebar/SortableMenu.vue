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
      menu: []
    }
  },
  watch: {
    menu (newVal) {
      this.$emit('onChanged', newVal)
    },
    drag (newVal) {
      logger.debug('newVal', newVal)
    }
  },
  created () {
    this.menu = this.items
  }
}
</script>

<style scoped>
.sortablemenu {
  width: 40px;
  height: auto;
}
</style>
