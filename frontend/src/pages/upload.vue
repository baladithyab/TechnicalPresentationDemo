<script setup lang='ts'>
import axios from 'axios'
const router = useRouter()
const filePresent = ref(false)
const s3UploadURL = ref()
const s3Uploadname = ref()
const file = ref()
const uploadPercentage = ref()

const go = () => {
  axios.put(s3UploadURL.value, file.value, {
    headers: {
      'Content-Type': file.value.type,
    },
    onUploadProgress: (event) => {
      uploadPercentage.value = Math.round(event.loaded / event.total * 100)
    },
  })
    .then((res) => {
      console.log(res)
      router.push('/')
    })
    .catch((err) => {
      console.log(err)
    })
}

const { t } = useI18n()

const uploadFile = (files: any) => {
  file.value = files[0]
  const reqbody = {
    contentType: files[0].type,
    fileName: files[0].name,
  }
  axios.post('https://cen7l2mcx6.execute-api.us-east-1.amazonaws.com/stage/echo', reqbody)
    .then((lambdaRes: any) => {
      console.log(lambdaRes)
      s3UploadURL.value = lambdaRes.data.url
      s3Uploadname.value = lambdaRes.data.fileName
      filePresent.value = true
      uploadPercentage.value = 0
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-campsite class="inline-block" />
    </p>
    <h1>Upload to S3</h1>

    <div class="py-4" />
    <input
      id="input"
      type="file"
      autocomplete="false"
      accept=".mp4"
      p="x-4 y-2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @change="uploadFile($event.target?.files)"
    />
    <div>
      <button class="m-3 text-sm btn" :disabled="!filePresent" @click="go">{{ t('button.upload') }}</button>
    </div>
    <div>
      <progress max="100" :value.prop="uploadPercentage"></progress>
    </div>
  </div>
</template>

<route lang='yaml'>
meta:
  layout: home
</route>
