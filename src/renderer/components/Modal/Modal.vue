<template>
  <div v-if="open" class="background" @click.self="closeModal">
    <dialog class="dialog centering">
      <div class="messages">
        <div v-for="(message, idx) in messages" :key="idx">
          {{ message }}
        </div>
      </div>
      <div class="ok oktopmargin">
        <MtButton @click.native="closeModal">
          OK
        </MtButton>
      </div>
    </dialog>
  </div>
</template>

<script>
import MtButton from '@/components/Form/MtButton'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('modal')
const { mapState } = createNamespacedHelpers('modal')
export default {
  components: {
    MtButton
  },
  computed: {
    ...mapState({ messages: state => state.messages, open: state => state.open })
  },
  methods: {
    ...mapActions(['closeModal'])
  }
}
</script>

<style scoped>
  .dialog {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 200px;
    font-size: 12px;
    border: 2px solid #ccc;
  }
  .ok {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
  }
  .centering {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .background {
    top: 0px;
    left: 0px;
    position: fixed;
    background: rgba(50,50,50, 0.5);
    width: 100%;
    height: 100%;
  }
  .oktopmargin {
    margin-top: 8px;
  }
</style>
