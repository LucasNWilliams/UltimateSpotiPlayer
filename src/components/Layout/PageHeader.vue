<template>
  <div class="page-header">
    <div class="page-header-left">
      <img src="../../assets/mediumLogo.png"
           alt="Medium Ultimate SpotiPlayer Logo"
           class="logo-medium"/>
    </div>
    <div class="page-header-center">
      <button @click="redirectToHome">test</button>
    </div>
    <div class="page-header-right">
      <p>{{ spotifyUser.display_name }}</p>
      <img :src="userProfileImage"
           alt="User Profile Image"
           class="user-profile-image">
    </div>
  </div>
</template>

<script setup lang="ts">
import {ISpotifyUser} from "@/spotifyDataTypeEnums";
import {computed} from "vue";
import {useRouter} from "vue-router";

interface IPageHeaderProps {
  spotifyUser: ISpotifyUser
}

const props = defineProps<IPageHeaderProps>()

const userProfileImage = computed(() => {
  return props.spotifyUser.images ? props.spotifyUser.images[1].url : undefined
})

const router = useRouter()

const redirectToHome = () => {
  router.push('/')
}

</script>

<style scoped>
.page-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2.5rem;
  margin: -.5rem -.5rem 1.5rem;
  height: 1.75rem;
  background-color: #282c34;
  position: sticky;
  top: 0;

  .page-header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    .logo-medium {
      width: 100px;
    }
  }
}

.logo-medium {
  width: 100px;
}

.user-profile-image {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
}
</style>
