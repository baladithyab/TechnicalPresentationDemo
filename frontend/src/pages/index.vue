<script setup lang="ts">
import axios from 'axios'

const router = useRouter()
const s3HLSObjects = ref()

const videos = ref()
const go = () => {
  axios.get('https://cen7l2mcx6.execute-api.us-east-1.amazonaws.com/stage/echo').then((res) => {
    console.log(res.data)
    s3HLSObjects.value = res.data
    if (res.data.length > 0) {
      videos.value = s3HLSObjects.value.map((obj) => { return { url: obj.Key, LastModified: new Date(obj.LastModified) } })
      videos.value.sort((a, b) => {
        const fa = a.LastModified
        const fb = b.LastModified

        if (fa < fb)
          return 1

        if (fa > fb)
          return -1

        return 0
      })
      console.log(videos.value)
    }
  })
}
const goToUpload = () => {
  router.push('/upload')
}

const { t } = useI18n()
</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-campsite class="inline-block" />
    </p>

    <p>
      {{ t('CSE 185 Technical Demo:') }}
      <br />Video Hosting as a Service
    </p>

    <div class="py-4" />

    <div>
      <button class="m-3 text-sm btn" @click="go">{{ t('button.GetVideos') }}</button>

      <button class="m-3 text-sm btn" @click="goToUpload">{{ t('button.upload') }}</button>
    </div>
    <div class="m-6">
      <div v-for="video in videos" :key="video.LastModified" class="m-3 bg-cyan-900">
        <router-link
          :to="`/player/${encodeURIComponent(video.url)}`"
          replace
        >https://d1bsfg6boy8d4i.cloudfront.net/{{ video.url }}</router-link>
        <br />
        <span>{{ video.LastModified }}</span>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
