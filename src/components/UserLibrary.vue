<template>
  <div v-if="spotifyUser.display_name">

    <div class="page-body">
      <ul class="library-list">
        <li v-for="item in userLibrary" :key="item.id">
          <AlbumCard v-if="instanceOfAlbum(item)"
                     :album="item"
                     @click="redirectToAlbum(item)"/>
          <PlaylistCard v-else-if="instanceOfPlaylist(item)"
                        :playlist="item"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from 'vue'
import { GetSpotifyAuthorization } from "@/API/spotifyAuthentication";
import {
  ISpotifyAlbum,
  ISpotifyAlbumsData,
  ISpotifyPlaylist,
  ISpotifyUser,
  IUserAlbum
} from "@/spotifyDataTypeEnums";
import {GetUserData, GetUserPlaylists, GetUserAlbums} from "@/components/api";
import {useRouter} from "vue-router";
import {SpotifyCollections} from "@/router";

const AlbumCard = defineAsyncComponent(() => import("@/components/Layout/AlbumCard.vue"))
const PlaylistCard = defineAsyncComponent(() => import("@/components/Layout/PlaylistCard.vue"))

const spotifyUser = ref<ISpotifyUser>({})

const userPlaylists = ref<ISpotifyPlaylist[]>([])
const userAlbums = ref<IUserAlbum[]>([])

type IUserLibrary = Array<ISpotifyPlaylist | IUserAlbum>
const userLibrary = ref<IUserLibrary>([])

const instanceOfPlaylist = (item: ISpotifyPlaylist | IUserAlbum): item is ISpotifyPlaylist => {
  return 'owner' in item
}

const instanceOfAlbum = (item: ISpotifyPlaylist | IUserAlbum): item is IUserAlbum => {
  return 'album' in item
}

const router = useRouter()

const redirectToAlbum = (album: IUserAlbum) => {
  router.push(
    {
      name: SpotifyCollections.Album,
      params: {
        albumId: album.album.id
      }
    })
}

const redirectToPlaylist = (playlist: ISpotifyPlaylist) => {
  router.push(
    {
      name: SpotifyCollections.Playlist,
      params: {
        playlistId: playlist.id
      }
    })
}

const getUserData = async () => {
  await GetUserData()
    .then((data) => {
      Object.assign(spotifyUser.value, data)
    })
}

const getUserPlaylists = async () => {
  await GetUserPlaylists()
    .then((data: ISpotifyPlaylist[]) => {
      userPlaylists.value.length = 0
      userPlaylists.value.push(...data)
      userLibrary.value = [...userAlbums.value, ...userPlaylists.value]
    })
}

const getUserAlbums = async () => {
  await GetUserAlbums()
    .then((data: IUserAlbum[]) => {
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
