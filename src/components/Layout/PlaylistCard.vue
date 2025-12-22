<template>
  <ItemCard :title="playlist.name"
            :artists="[playlist.owner.display_name]"
            :image="playlistImage"
            :item-type="playlist.type"/>
</template>

<script setup lang="ts">
import ItemCard from "@/components/Base/ItemCard.vue";
import {ISpotifyImage, ISpotifyPlaylist} from "@/spotifyDataTypeEnums";
import {computed} from "vue";

interface IPlaylistCardProps {
  playlist: ISpotifyPlaylist
}

const props = defineProps<IPlaylistCardProps>()

const playlistImage = computed(() => {
  return props.playlist.images ? props.playlist.images[0] : {} as ISpotifyImage
})

</script>

<style scoped>

</style>
