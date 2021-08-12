<template>
  <div class="loading">
    <div class="loadingicon">
      <IosSyncIcon
        w="40px"
        h="40px"
        animate="rotate"
      />
    </div>
  </div>
</template>

<script>
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue'
export default {
  components: {
    IosSyncIcon
  }
}
</script>

<style scoped>
.loading {
  position: absolute;
  top:0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.loadingicon {
  text-align: center;
  color: #00aaff;
}
</style>
