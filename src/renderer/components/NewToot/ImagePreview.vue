<template>
  <div class="image" :style="{width: imageWidth + 'px',height: imageHeight + 'px'}">
    <div v-if="file.state === 'done'">
      <template v-if="file.filePath.split('.').pop() !== 'mp4'">
        <img ref="imgPreview" class="img" :src="file.filePath" alt="">
      </template>
      <template v-else>
        <video ref="videoPreview" class="img" :src="file.filePath" />
      </template>
    </div>
    <div v-else>
      <svg ref="imgPreview" class="img" width="100" height="100">
        <rect x="0" y="0" width="100" height="100" fill="gray" />
      </svg>
    </div>
    <div class="absolute" :class="{ uploading:file.state === 'uploading',error: file.state === 'error' }">
      <div v-if="file.state === 'uploading'" class="state">
        <div class="spin">
          <ios-sync-icon w="25" h="25" />
        </div>
      </div>
      <div v-if="file.state === 'error'" class="state">
        <div>
          error
        </div>
      </div>
      <div class="close" @click="close">
        <div>
          <ios-close-icon title="close" w="16" h="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue'
import IosCloseIcon from 'vue-ionicons/dist/ios-close.vue'

export default {
  components: {
    IosSyncIcon,
    IosCloseIcon
  },
  props: {
    file: {
      type: Object,
      required: true
    },
    idx: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      imageWidth: 100,
      imageHeight: 100
    }
  },
  mounted () {
    if (this.$refs.imgPreview !== undefined) {
      this.$refs.imgPreview.addEventListener('load', () => {
        this.imageWidth = this.$refs.imgPreview.width
        this.imageHeight = this.$refs.imgPreview.height
      })
    }
    if (this.$refs.videoPreview !== undefined) {
      this.$refs.videoPreview.addEventListener('canplay', () => {
        this.imageWidth = this.$refs.videoPreview.getBoundingClientRect().width
        this.imageHeight = this.$refs.videoPreview.getBoundingClientRect().height
      })
    }
  },
  beforeDestroy () {
    if (this.$refs.imgPreview !== undefined) {
      this.$refs.imgPreview.removeEventListener('load', () => { })
    }
    if (this.$refs.videoPreview !== undefined) {
      this.$refs.imgPreview.removeEventListener('loaddeddata', () => { })
    }
  },
  methods: {
    close () {
      this.$emit('remove', this.idx)
    }
  }
}
</script>

<style scoped>
.image {
  position: relative;
  color: #eeeeee;
}
.img {
  max-width: 100px;
  max-height: 100px;
  display: block;
}
.absolute {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}
.uploading {
  background-color: rgba(0, 0, 0, 0.5);
}
.error {
  background-color: rgba(0, 0, 0, 1);
}
.close {
  position: absolute;
  background-color: rgba(58, 51, 51, 1);
  width: 16px;
  height: 15px;
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.image:hover .close {
  display: flex;
}
.state {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spin {
  animation: spin 1s linear infinite;
  width: 25px;
  height: 25px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
