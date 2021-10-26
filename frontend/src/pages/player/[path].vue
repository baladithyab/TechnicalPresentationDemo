<script setup lang="ts">

const props = defineProps<{ path: string }>()
const router = useRouter()
const { t } = useI18n()

const srcUrl = `https://d1bsfg6boy8d4i.cloudfront.net/${props.path}`

const play = () => {
  if (Hls.isSupported()) {
    const video = document.getElementById('video')
    const hls = new Hls()
    hls.loadSource(srcUrl);
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play()
    })
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = srcUrl
    video.addEventListener('canplay', () => {
      video.play()
    })
  }
}

const goToUpload = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-video class="inline-block" />
    </p>
    <p>{{ props.path }}</p>
    <div class="justify-items-center">
      <video class="display-block m-auto" id="video" width="352" height="198" controls></video>
    </div>
    <div>
      <button class="btn m-3 text-sm mt-6" @click="play()">Play</button>

      <button class="btn m-3 text-sm mt-6" @click="goToUpload">{{ t('button.back') }}</button>
    </div>
  </div>
</template>