<template>
  <div v-if="spotifyUser.display_name">
    <div>
      <h1>Welcome {{ spotifyUser.display_name }}</h1>
      <img :src="spotifyUser.images ? spotifyUser.images[1].url : null" alt="Profile image">
    </div>
    <h2>Total Followers: {{ spotifyUser.followers.total }}</h2>
    <ol>
      <li v-for="track in userPlaylists" :key="track.id">
        {{ track.name }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { GetSpotifyAuthorization } from "@/API/crud.js";
import {ISpotifyPlaylistType, ISpotifyUserType} from "@/enums";
import {GetUserData, GetUserPlaylists} from "@/components/api";

const spotifyUser = ref<ISpotifyUserType>({})
const userPlaylists = ref<ISpotifyPlaylistType[]>([])

const getUserData = async () => {
  await GetUserData()
    .then((data) => {
      Object.assign(spotifyUser.value, data)
    })
}

const getUserPlaylists = async () => {
  await GetUserPlaylists()
    .then((data: ISpotifyPlaylistType[]) => {
      userPlaylists.value.length = 0
      userPlaylists.value.push(...data)
    })
}

onMounted(() => {
  GetSpotifyAuthorization()
  getUserData()
  getUserPlaylists()
})
</script>

<style scoped>

</style>
