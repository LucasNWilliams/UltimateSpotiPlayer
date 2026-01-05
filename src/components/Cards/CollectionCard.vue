<template>
  <div class="base-card">
    <div class="header">
      <img :src="image.url"
           :alt="title + ' Cover Image'"
           height="64"
           width="64"
           class="cover-image"/>
      <h1>{{ title }}</h1>
    </div>
    <div class="bottom-line">
      <div class="artists">
        <p>{{ artistsNames }}</p>
      </div>
      <div class="item-type-div" v-if="itemType">
        <p class="item-type">{{ itemType }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ISpotifyImage} from "@/spotifyDataTypeEnums";

interface IBaseCardProps {
  title: string
  artists: string[]
  image: ISpotifyImage
  itemType?: string
}

const props = defineProps<IBaseCardProps>()

const artistsNames = props.artists.join(', ')
</script>

<style>
.base-card {
  border-color: #6f747d;
  border-style: solid;
  border-radius: 2rem;
  border-width: .25rem;
  padding: .5rem 1rem;
  margin: 1rem;
  background-color: #252930;
  width: 24rem;
  cursor: pointer;

  .header {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 1.25rem;

    img {
      border-radius: 15%;
    }

    h1 {
      display: inline-block;
      font-size: 1.5rem;
      margin: 0;
      max-width: calc(100%);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .bottom-line {
    display: flex;
    justify-content: space-between;
    align-items: end;

    .artists {
      display: flex;
      gap: .5rem;
    }

    .item-type-div {
      .item-type {
        text-transform: capitalize;
        font-size: 12px;
      }
    }
  }

}
</style>
