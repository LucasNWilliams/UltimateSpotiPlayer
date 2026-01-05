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
import {onBeforeMount, ref, watch} from "vue";
import {ISpotifyUser} from "@/spotifyDataTypeEnums";
import {GetSpotifyAuthorization} from "@/API/spotifyAuthentication";
import {useRoute} from "vue-router";

const spotifyUser = ref<ISpotifyUser>({})

const getUserData = async () => {
  await GetUserData()
    .then((data) => {
      Object.assign(spotifyUser.value, data)
    })
}

onBeforeMount(async () => {
  await GetSpotifyAuthorization()
    .then(async () => {
      await getUserData()
    })
})

const route = useRoute()

watch(route, async () => {
  await GetSpotifyAuthorization()
    .then(async () => {
      await getUserData()
    })
})
</script>

<style scoped>

</style>
