<template>
  <p>
    {{ message }}
  </p>
</template>

<script>
import pow from '../other/pow'
export default {
  name: 'Hello',
  data: function () {
    return {
      message: 0
    }
  },
  mounted () {
    this.message = pow(2, 10)
  }
}
</script>

<style scoped>
p {
  color: blue;
}
</style>
