<template>
  <div v-if="album.id">
    <div class="album-header">
      <img :src="album.images[0].url"
           :alt="albumImageAlt"
           class="album-cover"/>
      <div class="album-info">
        <h1 class="album-title">{{ album.name }}</h1>

        <div class="secondary-album-info">
          <p class="artist-names">{{ artistsNames }}</p>

          <hr/>

          <p>{{ album.total_tracks }} Songs</p>

          <p v-if="false">{{ album.popularity }} Popularity</p>
        </div>
      </div>
    </div>
    <div class="album-content">

    </div>
    <div class="album-footer">
      <p v-for="copyright in album.copyrights"
         :key="copyright.text"
         class="copyright">{{ copyright.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {GetAlbum} from "@/components/api";
import {ISpotifyAlbum} from "@/spotifyDataTypeEnums";

const album = ref<ISpotifyAlbum>({} as ISpotifyAlbum)

const albumImageAlt = `${album.value.name} Album Cover`

const artistsNames = computed(() => {
  return album.value.artists.map((artist) => artist.name).join(', ')
})

const route = useRoute()

onMounted(() => {
  GetAlbum(route.params.albumId as string)
    .then((data: ISpotifyAlbum) => {
      Object.assign(album.value, data)
      console.log(data)
    })
})
</script>

<style scoped>
.album-header {
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 5rem;
  background-color: #131519;
  margin: -1.5rem -.5rem 0;
  padding: 3rem;

  .album-cover {
    height: 20rem;
    border-radius: 2.5%;
  }

  .album-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .album-title {
      font-size: 4.5rem;
      margin-bottom: .5rem;
    }

    .secondary-album-info {
      display: flex;
      gap: 3rem;
      justify-content: start;
      font-size: 1.5rem;

      hr {
        margin-left: 0;
        margin-right: 0;
      }

      .artist-names {
        padding-left: 4rem;
      }
    }
  }
}

.album-footer {
  color: #7a7a7a;

  .copyright {
    margin: .25rem;
  }
}
</style>
