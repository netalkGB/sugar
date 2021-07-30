<template>
  <button v-if="type === 'submit'" :disabled="disabled" class="button submit">
    <slot />
  </button>
  <button v-else-if="type === 'danger'" :disabled="disabled" class="button danger">
    <slot />
  </button>
  <button v-else :disabled="disabled" class="button normal">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'normal',
      required: false
    },
    disabled: {
      type: Boolean,
      defualt: false,
      required: false
    }
  }
}
</script>

<style scoped>
.button {
  border-style: none;
  background-color: transparent;
  padding: 4px 12px;
  border-radius: 2px;
  text-align: center;
  outline: none;
  color: #222222;
}
.button.submit {
  background-color: #4285f4;
  border: 1px solid #4285f4;
  color: #f5f5f5;
}
.button.submit:hover {
  background-color: #3b78e7;
  border: 1px solid #3b78e7;
}
.button.submit:active {
  background-color: #376fd4;
  border: 1px solid #376fd4;
}
.button.submit:disabled {
  background-color: #86a6e2;
  border: 1px solid #86a6e2;
}

.button.danger {
  background-color: #ed5c65;
  border: 1px solid #ed5c65;
  color: #f5f5f5;
}
.button.danger:hover {
  background-color: #db545d;
  border: 1px solid #db545d;
}
.button.danger:active {
  background-color: #cf4a53;
  border: 1px solid #cf4a53;
}
.button.danger:disabled {
  background-color: #cf777d;
  border: 1px solid #cf777d;
}

.button.normal {
  background-color: #fefefe;
  border: 1px solid #bbbbbb;
  color: #222222;
}
.button.normal:hover {
  background-color: #eeeeee;
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.3);
}
.button.normal:active {
  background-color: #e5e5e5;
}
.button.normal:disabled {
  background-color: #ffffff;
  color: #bbbbbb;
}
.button.normal:disabled:hover {
  background-color: #ffffff;
  box-shadow: none;
}
</style>
