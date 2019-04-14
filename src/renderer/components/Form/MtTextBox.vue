<template>
  <div v-if="type === 'search'">
    <div
      class="textBoxWrapper"
      :class="{'enable': disabled === false, 'disable': disabled === true }"
      @click="focus"
    >
      <input
        type="text"
        class="textBox searchTextBox"
        v-model="val"
        ref="textbox"
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
        type="text"
        class="textBox normalTextBox"
        v-model="val"
        ref="textbox"
        :placeholder="placeholder"
        :disabled="disabled"
      >
    </div>
  </div>
</template>

<script>
export default {
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
  methods: {
    setVal (value) {  
      this.val = value
    },
    focus () {
      this.$refs.textbox.focus()
    },
    reset () {
      if (this.disabled === true) {
        return
      }
      this.setVal('')
      this.focus()
    }
  },
  data () {
    return {
      val: ''
    }
  },
  mounted () {
    this.setVal(this.value)
    this.$emit('input', this.value)
  },
  computed: {
    len: function () {
      return this.val.length
    },
    isVisibleClearButton: function () {
      return this.len > 0 && this.disabled === false
    }
  },
  watch: {
    val: function (newVal) {
      this.$emit('input', newVal)
    }
  }
}
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
  width: 150px;
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
}
.textBox::placeholder {
  color: #aaaaaa;
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
