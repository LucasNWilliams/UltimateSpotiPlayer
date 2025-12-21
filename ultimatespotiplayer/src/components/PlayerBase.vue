<template>
  <div v-if="spotifyUser.display_name">
    <PageHeader :spotify-user="spotifyUser"/>

    <div class="page-body">
      <ul class="library-list">
        <li v-for="item in userLibrary" :key="item.id">
          <AlbumCard v-if="instanceOfAlbum(item)"
                     :album="item"/>
          <PlaylistCard v-else-if="instanceOfPlaylist(item)"
                        :playlist="item"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from 'vue'
import { GetSpotifyAuthorization } from "@/API/spotifyAuth";
import {ISpotifyAlbumType, ISpotifyPlaylistType, ISpotifyUserType, IUserAlbumType} from "@/enums";
import {GetUserData, GetUserPlaylists, GetUserAlbums} from "@/components/api";
import PageHeader from "@/components/Layout/PageHeader.vue";

const AlbumCard = defineAsyncComponent(() => import("@/components/Layout/AlbumCard.vue"))
const PlaylistCard = defineAsyncComponent(() => import("@/components/Layout/PlaylistCard.vue"))

const spotifyUser = ref<ISpotifyUserType>({})
const userPlaylists = ref<ISpotifyPlaylistType[]>([])
const userAlbums = ref<IUserAlbumType[]>([])
const userLibrary = ref<(ISpotifyPlaylistType | IUserAlbumType)[]>([])

const instanceOfPlaylist = (item: ISpotifyPlaylistType | ISpotifyAlbumType): item is ISpotifyPlaylistType => {
  return 'owner' in item
}

const instanceOfAlbum = (item: ISpotifyPlaylistType | ISpotifyAlbumType): item is ISpotifyAlbumType => {
  return 'album' in item
}

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
      userLibrary.value = [...userAlbums.value, ...userPlaylists.value]
    })
}

const getUserAlbums = async () => {
  await GetUserAlbums()
    .then((data: IUserAlbumType[]) => {
      userAlbums.value.length = 0
      userAlbums.value.push(...data)
      userLibrary.value = [...userAlbums.value, ...userPlaylists.value]
    })
}

onMounted(async () => {
  await GetSpotifyAuthorization()
    .then(async () => {
      await getUserData()
      await Promise.allSettled([getUserPlaylists(), getUserAlbums()])
    })
})
</script>

<style scoped>
.page-body {
  scrollbar-width: none;

  .library-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    padding: 0;
  }
}
</style>
