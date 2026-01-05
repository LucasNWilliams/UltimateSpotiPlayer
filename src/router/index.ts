import {createRouter, createWebHistory} from "vue-router";
import AppLayout from "@/components/AppLayout.vue";

export enum UserRoutes {
  UserLibrary = 'User UserLibrary',
}

export enum Collections {
  Album = 'Collection Album',
  Playlist = 'Collection Playlist',
}

const routes = [
  {
    path: '/callback',
    component: () => import('@/router/CallbackRedirect.vue')
  },
  {
    path: '/project',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: UserRoutes.UserLibrary,
        component: () => import('@/components/UserLibrary.vue')
      },
      {
        path: '/album/:albumId',
        name: Collections.Album,
      },
      {
        path: '/playlist/:playlistId',
        name: Collections.Playlist,
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
