<template>
  <div id="time" :title="localTime">30m</div>
</template>

<script>
export default {
  props: ['date'],
  computed: {
    localTime () {
      return this.date.toLocaleString()
    }
  }
}
</script>

<style scoped>
#time {
  width: 24px;
}
</style>
