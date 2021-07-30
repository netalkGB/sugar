<template>
  <div v-if="type === 'search'">
    <div
      class="textBoxWrapper"
      :class="{'enable': disabled === false, 'disable': disabled === true }"
      @click="focus"
    >
      <input
        ref="textbox"
        v-model="val"
        type="text"
        class="textBox searchTextBox"
        :placeholder="placeholder"
        :disabled="disabled"
      >
      <input
        type="button"
        class="clearButton"
        value="x"
        :style="{ visibility: isVisibleClearButton ? 'visible' : 'hidden' }"
        @click="reset"
      >
    </div>
  </div>
  <div v-else>
    <div
      class="textBoxWrapper"
      :class="{'enable': disabled === false, 'disable': disabled === true }"
    >
      <input
        ref="textbox"
        v-model="val"
        type="text"
        class="textBox normalTextBox"
        :placeholder="placeholder"
        :disabled="disabled"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'normal'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: ''
    }
  },
  computed: {
    len ():number {
      return this.val.length
    },
    isVisibleClearButton ():boolean {
      return this.len > 0 && this.disabled === false
    }
  },
  watch: {
    val (newVal:string) {
      this.$emit('input', newVal)
    }
  },
  mounted () {
    this.setVal(this.value)
    this.$emit('input', this.value)
  },
  methods: {
    setVal (value:string) {
      this.val = value
    },
    focus () {
      const textbox = this.$refs.textbox as HTMLInputElement
      textbox.focus()
    },
    reset () {
      if (this.disabled === true) {
        return
      }
      this.setVal('')
      this.focus()
      this.$emit('cleared')
    }
  }
})
</script>

<style scoped>
.enable {
  background-color: #fefefe;
}
.disable {
  background-color: #dddddd;
}
.textBoxWrapper {
  display: inline-flex;
  border: 1px solid #bbbbbb;
  height: inherit;
  padding: 0px;
  width: 100%;
}
.textBoxWrapper:hover {
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.3);
}
.textBox {
  border: 0px;
  background-color: inherit;
  padding: 3px 4px;
  border-radius: 2px;
  outline: none;
  height: calc(inherit - 2px);
}
.textBox::placeholder {
  color: #aaaaaa;
  font-size: 10px;
}
.searchTextBox {
  width: calc(100% - 20px);
}
.normalTextBox {
  width: 100%;
}
.clearButton {
  background-color: inherit;
  border: 0px solid #fefefe;
  outline: none;
  color: #888888;
  width: 20px;
  font-size: 10px;
  cursor: pointer;
}
</style>
