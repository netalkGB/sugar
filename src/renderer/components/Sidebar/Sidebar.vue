<template>
  <div id="sidebar">
    <div>
      <SortableMenu />
      <Icon to="#" icon="addTab" />
    </div>
    <div>
      <div @click="newToot">
        <Icon icon="toot" />
      </div>
      <Icon to="#" icon="settings" />
    </div>
  </div>
</template>

<script>
import SortableMenu from './SortableMenu'
import Icon from './Icon'
const keyCodeN = 78
export default {
  components: { SortableMenu, Icon },
  props: { userId: Number },
  methods: {
    newToot () {
      const url = this.$router.resolve(`/newtoot/${this.userId}`).href
      window.open(url, '_blank', 'width=400,height=240')
    }
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (((e.ctrlKey || e.metaKey) && e.keyCode === keyCodeN)) {
        this.newToot()
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('input', () => { })
  }
}
</script>

<style scoped>
#sidebar {
  background-color: #efefef;
  height: 100%;
  border-right: thin solid #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
