<template>
  <router-view/>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import { useRouter } from 'vue-router'
import {GetSpotifyAuthorization} from "@/API/spotifyAuthentication";

const router = useRouter()

onMounted(async () => {

  await GetSpotifyAuthorization()
    .then(() => {
      router.push('/')
    })
})
</script>

<style scoped>

</style>
