<template>
  <div class="container">
    <div class="icon">
      <MdPersonAddIcon :w="'12'" :h="'12'" class="followedBy" />
    </div>
    <div class="message">
      フォローされました
    </div>
  </div>
</template>

<script>
import MdPersonAddIcon from 'vue-ionicons/dist/md-person-add.vue'

export default {
  components: { MdPersonAddIcon },
  props: ['followedBy']
}
</script>

<style scoped>
:root {
  --icon-size: 12px;
}
.container {
  display: flex;
}
.icon {
  width: var(--icon-size);
  height: 15px;
  display: flex;
  align-items: center;
}
.message {
  width: calc(100% - var(--icon-size));
}

.followedBy {
  color: #0000ff;
}

</style>
