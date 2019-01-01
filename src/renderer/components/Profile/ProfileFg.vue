<template>
  <div>
    <div
      class="imageContainer"
      v-if="shortMode === false"
    >
      <div
        class="image"
        @click="$emit('toggle')"
      >
        <img
          class="img"
          :src="avatar"
          width="40"
          height="40"
        >
      </div>
    </div>
    <div class="idnameContainer">
      <div
        class="idname"
        @click="$emit('toggle')"
      >
        <span class="id">{{displayName}}</span>
        <IosLockIcon
          :w="'12'"
          :h="'12'"
          v-if="locked"
        />
      </div>
      <div
        class="idname"
        @click="$emit('toggle')"
      >{{userid}}</div>
    </div>
    <div class="paddingLR">
      <MastodonHTML
        @click="handleClick"
        :html="note"
        v-if="shortMode === false"
      />
    </div>
  </div>
</template>

<script>
import MastodonHTML from '@/components/MastodonHTML/MastodonHTML'
import logger from '@/other/Logger'
const ipcRenderer = window.ipc
export default {
  props: ['shortMode', 'avatar', 'displayName', 'locked', 'userid', 'note'],
  components: {
    MastodonHTML
  },
  methods: {
    handleClick (ev) {
      const { type } = ev
      if (type === 'hashtag') {
        const { href, tag } = ev
        logger.debug('[hashtag]', href, tag)
      } else if (type === 'user') {
        const { href } = ev
        logger.debug('[user]', href)
        ipcRenderer.send('openURL', href)
      } else {
        const { href } = ev
        ipcRenderer.send('openURL', href)
      }
    }
  }
}
</script>

<style scoped>
.imageContainer {
  padding-top: 4px;
  height: calc(100% / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.image {
  cursor: pointer;
}
.img {
  cursor: pointer;
  border-radius: 2px;
  pointer-events: none;
}
.idnameContainer {
  height: calc(100% / 2);
}
.id {
  font-weight: bolder;
}
.idname {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.paddingLR {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
