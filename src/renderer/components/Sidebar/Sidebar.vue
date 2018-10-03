<template>
  <div id="sidebar">
    <div>
      <SortableMenu />
      <Icon to="#" icon="addTab"/>
    </div>
    <div>
      <Icon to="#" icon="settings" />
    </div>
  </div>
</template>

<script>
import SortableMenu from './SortableMenu'
import Icon from './Icon'
export default {
  components: { SortableMenu, Icon }
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
