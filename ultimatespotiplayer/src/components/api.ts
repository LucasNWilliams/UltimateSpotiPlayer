import {ISpotifyPlaylistType} from "@/enums";

const spotifyUrl = 'https://api.spotify.com/v1'
const accessToken = sessionStorage.getItem('access_token')

const GetUserData = async () => {
  return await fetch(spotifyUrl + '/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw await response.json()
      }
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error("Could not get user data:", error)
    })
}

interface IPlaylistsDataType {
  href: string,
  items: ISpotifyPlaylistType[]
  limit: number,
  next: string | null,
  offset: number,
  previous: string | null,
  total: number
}

const GetUserPlaylists = async (url = spotifyUrl + '/me/playlists', playlists = []): Promise<IPlaylistsDataType | never[]> => {
  return await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw await response.json()
      }
    })
    .then((data) => {
      console.log(data)
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

export {
  GetUserData,
  GetUserPlaylists
}
