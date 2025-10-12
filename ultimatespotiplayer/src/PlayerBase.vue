<template>
<h1>Hello World</h1>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {checkSpotifyAuthorization} from "@/API/api.ts";


const urlParams = new URLSearchParams(window.location.search);
const code: string = urlParams.get('code')

const test = ref()

onMounted(() => {
  checkSpotifyAuthorization(code)
})
</script>

<style scoped>

</style>
