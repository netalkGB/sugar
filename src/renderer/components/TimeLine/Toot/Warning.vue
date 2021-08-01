<template>
  <div class="warning">
    !!!&nbsp;閲覧注意{{comment}}&nbsp;!!!
  </div>
</template>

<script>
export default {
  props: {
    reason: {
      type: String,
      default: ''
    }
  },
  computed: {
    comment: function () {
      return this.reason.length > 0 ? `(${this.reason})` : ''
    }
  }
}
</script>

<style scoped>
.warning {
  cursor: pointer;
}
</style>
