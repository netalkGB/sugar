<template>
  <select :disabled="disabled" class="select" @change="handleChange">
    <slot />
  </select>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      defualt: false,
      required: false
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style scoped>
.select {
  border: 1px solid #bbbbbb;
  background-color: #fefefe;
  padding: 3px 4px;
  border-radius: 2px;
  outline: none;
}
.select:disabled {
  background-color: white;
}
.select:hover {
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.3);
}
.select:disabled:hover {
  box-shadow: none;
}
</style>
