<template>
  <span
    ref="tltext"
    v-html="html"
  />
</template>

<script>
import logger from '@/other/Logger'
export default {
  props: ['html'],
  data () {
    return {
      users: null,
      hashtags: null,
      links: null,
      atag: null
    }
  },
  updated () {
    this.setup()
  },
  mounted () {
    this.setup()
  },
  beforeDestroy () {
    if (this.users !== null) {
      for (const a of this.users) {
        a.removeEventListener('click', (e) => { })
      }
    }
    if (this.hashtags !== null) {
      for (const a of this.hashtags) {
        a.removeEventListener('click', (e) => { })
      }
    }
    if (this.links !== null) {
      for (const a of this.links) {
        a.removeEventListener('click', (e) => { })
      }
    }
    if (this.atag !== null) {
      for (const a of this.atag) {
        a.removeEventListener('click', (e) => { })
      }
    }
  },
  methods: {
    setup () {
      if (!this.html) {
        return
      }
      const tltext = this.$refs.tltext
      this.atag = tltext.querySelectorAll('a')
      for (const a of this.atag) {
        a.addEventListener('click', (e) => {
          e.preventDefault()
        })
      }
      this.users = tltext.querySelectorAll('a.u-url')
      for (const user of this.users) {
        user.addEventListener('click', (e) => {
          e.preventDefault()
          const href = user.href
          const split = href.split('/')
          logger.debug('user', split[2], split[3], href)
          const click = {
            type: 'user',
            href
          }
          this.$emit('click', click)
        })
      }
      this.hashtags = tltext.querySelectorAll('a.hashtag')
      for (const hashtag of this.hashtags) {
        hashtag.addEventListener('click', (e) => {
          e.preventDefault()
          const href = hashtag.href
          const tag = hashtag.querySelector('a > span').textContent
          logger.debug(href)
          logger.debug(tag)
          const click = {
            type: 'hashtag',
            href,
            tag
          }
          this.$emit('click', click)
        })
      }
      this.links = tltext.querySelectorAll('a[target="_blank"]')
      for (const link of this.links) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          if (link.textContent && link.textContent.split('')[0] === '@') {
            return
          }
          const href = link.href
          logger.debug(href)
          const click = {
            type: 'hyperlink',
            href
          }
          this.$emit('click', click)
        })
      }
    }
  }
}
</script>

<style>
</style>
