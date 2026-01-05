import {ISpotifyAlbum, ISpotifyPlaylist, IUserAlbum} from "@/spotifyDataTypeEnums";
import {GetSpotifyAuthorization} from "@/API/spotifyAuthentication";

const spotifyUrl = 'https://api.spotify.com/v1'
let accessToken: string | null
// TODO App does not work first time when localStorage is empty
//        most likely a timing issue

const GetUserData = async () => {
  accessToken = localStorage.getItem('access_token')
  return await fetch(spotifyUrl + '/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json()
      } else {
        GetSpotifyAuthorization()
          .then(() => {
            return GetUserData()
          })
          .catch((error) => {
            console.error("Could not authorize GetUserData:", error)
          })
      }
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error("Could not get user data:", error)
    })
}

const GetUserPlaylists = async (url = spotifyUrl + '/me/playlists', playlists: ISpotifyPlaylist[] = []): Promise<void | ISpotifyPlaylist[] | never[]> => {
  return await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json()
      } else {
        GetSpotifyAuthorization()
          .then(() => {
            return GetUserPlaylists()
          })
          .catch((error) => {
            console.error("Could not authorize GetUserPlaylists:", error)
          })
      }
    })
    // TODO Make so it returns then runs after
    .then((data) => {
      playlists.push(...data.items)
      if (data.next) {
        return GetUserPlaylists(data.next, playlists)
      } else {
        return playlists
      }
    })
    .catch((error) => {
      console.error("Could not get user playlists:", error)
    })
}

const GetUserAlbums = async (url = spotifyUrl + '/me/albums', albums: ISpotifyAlbum[] = []): Promise<void | IUserAlbum[] | never[]> => {
  return await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    }
  })
  .then(async (response) => {
    if (response.ok) {
      return response.json()
    } else {
      GetSpotifyAuthorization()
        .then(() => {
          return GetUserAlbums()
        })
        .catch((error) => {
          console.error("Could not authorize GetUserAlbums:", error)
        })
    }
  })
    .then((data) => {
      albums.push(...data.items)
      if (data.next) {
        return GetUserAlbums(data.next, albums)
      } else {
        return albums
      }
    })
    .catch((error) => {
      console.error("Could not get user albums:", error)
    })
}

const GetAlbum = async (albumId: string) => {
  return await fetch(spotifyUrl + '/albums/' + albumId, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    }
  })
  .then(async (response) => {
    if (response.ok) {
      return response.json()
    } else {
      GetSpotifyAuthorization()
        .then(() => {
          return GetAlbum(albumId)
        })
        .catch((error) => {
          console.error("Could not get album:", error)
        })
    }
  })
}

export {
  GetUserData,
  GetUserPlaylists,
  GetUserAlbums,
  GetAlbum
}
