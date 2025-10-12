import type {IApiPayloadType, IApiResponseType} from "@/API/enums.ts";

const clientId = '24e4d5e0bf7a4e56b2d6ef4a9afe0817'
const redirectUri = 'http://[::1]:5173/callback'

// defines scope of api calls
const scope = 'app-remote-control user-read-currently-playing playlist-read-private playlist-read-collaborative user-library-read user-read-email user-read-private'
const authUrl = new URL("https://accounts.spotify.com/authorize")
const spotifyUrl = 'https://api.spotify.com/v1'

let accessToken: string | null = localStorage.getItem('access_token') || null
let refreshToken: string | null = localStorage.getItem('refresh_token') || null

let expiresAt: number | null = localStorage.getItem('expires_at') ? parseInt(localStorage.getItem('expires_at') || '') : null

// creates a string of random characters as a code verifier
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// generates a code challenge in SHA256 format
const generateCodeChallenge = async (codeVerifier: string) => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  )

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

//
const generateUrlWithSearchParams = (url: URL, params: URLSearchParams) => {
  const urlObject = new URL(url)
  urlObject.search = new URLSearchParams(params).toString()
  return urlObject.toString()
}

const redirectToSpotifyAuthorizeEndpoint = () => {
    const codeVerifier = generateRandomString(64)

    generateCodeChallenge(codeVerifier)
      .then((codeChallenge) => {
        window.localStorage.setItem('code_verifier', codeVerifier)

        const params =  {
          response_type: 'code',
          client_id: clientId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri,
        }

        // This changes the url to authorize Spotify
        window.location.href = generateUrlWithSearchParams(authUrl, params)
      })
}

const exchangeToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier')

  const url = 'https://accounts.spotify.com/api/token'
  const payload: IApiPayloadType = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier ? codeVerifier.toString() : ''
    }),
  }

  await fetch(url, payload)
    .then(addThrowErrorToFetch)
    .then((data) => {
      processTokenResponse(data)

      window.history.replaceState({}, document.title, '/')
    })
    .catch((error) => {
      console.error(error)
    })
}

const addThrowErrorToFetch = async (response: Response) => {
  if (response.ok) {
    return response.json()
  } else {
    throw { response, error: await response.json() }
  }
}

const processTokenResponse = (data: IApiResponseType) => {
  console.log(data)

  accessToken = data.access_token
  refreshToken = data.refresh_token

  const today = new Date()
  expiresAt = today.setSeconds(today.getSeconds() + data.expires_in)

  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  localStorage.setItem('expires_at', expiresAt.toString())

  getUserData()
}

const getUserData = () => {
  fetch(spotifyUrl + '/me', {
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
    })
    .catch((error) => {
      console.error(error)
    })
}

const checkSpotifyAuthorization = (code: string) => {
  if (code) {
    // we have received the code from Spotify and will exchange it for an accessToken
    exchangeToken(code)
  } else if (accessToken && refreshToken && expiresAt) {
    // we are authorized and reload our tokens from localStorage
    getUserData()
  } else {
    // we are not logged in redirect to log in
    redirectToSpotifyAuthorizeEndpoint()
  }
}

export {
  exchangeToken,
  redirectToSpotifyAuthorizeEndpoint,
  checkSpotifyAuthorization
}
