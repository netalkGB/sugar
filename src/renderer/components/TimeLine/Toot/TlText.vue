<template>
  <div
    ref="tltext"
    v-html="content"
  ></div>
</template>

<script>
import { shell } from 'electron'
import { mapActions } from 'vuex'
import logger from '@/other/Logger'
export default {
  props: ['content', 'mentions'],
  data () {
    return {
      users: null,
      hashtags: null,
      links: null,
      atag: null
    }
  },
  methods: {
    ...mapActions('timelines', ['profile'])
  },
  mounted () {
    const tltext = this.$refs.tltext
    this.atag = tltext.querySelectorAll('a')
    for (let a of this.atag) {
      a.addEventListener('click', e => {
        e.preventDefault()
      })
    }
    this.users = tltext.querySelectorAll('a.u-url')
    for (let user of this.users) {
      user.addEventListener('click', e => {
        e.preventDefault()
        const href = user.href
        const split = href.split('/')
        logger.debug('user', split[2], split[3], href)
        console.log(this.mentions)
        if (this.mentions) {
          const mention = this.mentions.find(m => m.url === href)
          console.log(mention.id)
          if (mention) {
            this.profile({ internalid: mention.id })
          }
        }
      })
    }
    this.hashtags = tltext.querySelectorAll('a.hashtag')
    for (let hashtag of this.hashtags) {
      hashtag.addEventListener('click', e => {
        e.preventDefault()
        const href = hashtag.href
        const tag = hashtag.querySelector('a > span').textContent
        logger.debug(href)
        logger.debug(tag)
      })
    }
    this.links = tltext.querySelectorAll('a[target="_blank"]')
    for (let link of this.links) {
      link.addEventListener('click', e => {
        e.preventDefault()
        if (link.textContent && link.textContent.split('')[0] === '@') {
          return
        }
        const href = link.href
        logger.debug(href)
        shell.openExternal(href)
      })
    }
  },
  beforeDestroy () {
    for (let a of this.users) {
      a.removeEventListener('click', (e) => { })
    }
    for (let a of this.hashtags) {
      a.removeEventListener('click', (e) => { })
    }
    for (let a of this.links) {
      a.removeEventListener('click', (e) => { })
    }
    for (let a of this.atag) {
      a.removeEventListener('click', (e) => { })
    }
  }
}
</script>

<style scoped>
</style>
