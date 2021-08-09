<template>
  <div
    class="time"
    :title="localTime"
    @click="$emit('click')"
  >
    {{ diffAndFormat }}
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data () {
    return {
      nowDate: Date.now(),
      timer: null
    }
  },
  computed: {
    localTime () {
      return this.date.toLocaleString()
    },
    diffAndFormat () {
      const diff = this.nowDate - this.date
      const sec = diff / 1000
      const min = sec / 60
      if (min < 1) {
        return sec >= 0 ? Math.floor(sec) + 's' : 0 + 's'
      }
      const hour = min / 60
      if (hour < 1) {
        return Math.floor(min) + 'm'
      }
      const day = hour / 24
      if (day < 1) {
        return Math.floor(hour) + 'h'
      }
      const month = day / (365 / 12)
      if (month < 1) {
        return Math.floor(day) + 'd'
      }
      const year = day / 365
      if (year < 1) {
        return Math.floor(month) + 'M'
      }
      return Math.floor(year) + 'y'
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.nowDate = Date.now()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.time {
  width: 24px;
  text-align: right;
  cursor: pointer;
}
</style>
