<template>
  <div>
  <PageHeader :spotify-user="spotifyUser"/>
  </div>

  <div>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/Layout/PageHeader.vue";
import {GetUserData} from "@/components/api";
import {onMounted, ref} from "vue";
import {ISpotifyUser} from "@/spotifyDataTypeEnums";
import {GetSpotifyAuthorization} from "@/API/spotifyAuthentication";

const spotifyUser = ref<ISpotifyUser>({})

const getUserData = async () => {
  await GetUserData()
    .then((data) => {
      Object.assign(spotifyUser.value, data)
    })
}

onMounted(async () => {
  await GetSpotifyAuthorization()
    .then(async () => {
      await getUserData()
    })
})
</script>

<style scoped>

</style>
