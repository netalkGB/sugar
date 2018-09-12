<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    <div id="menu">
      <Sidebar />
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import logger from '../other/Logger'
import Sidebar from '../components/Sidebar'
export default {
  props: { userId: Number },
  components:{
    Sidebar
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.addEventListener("resize", e => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      logger.debug(this.width, this.height);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize");
  }
};
</script>

<style scoped>
#main {
  display: flex;
  /* background-color: gainsboro; */
}
#content {
  width: calc(100% - 40px);
  /* background-color: aqua; */
}
#menu {
  width: 40px;
}
</style>
