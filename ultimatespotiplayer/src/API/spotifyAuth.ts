import type {IApiPayloadType, IApiResponseType} from "@/API/enums.ts";
import {GetUserData} from "@/components/api";

const clientId = '24e4d5e0bf7a4e56b2d6ef4a9afe0817'
const redirectUri = 'http://[::1]:5173/callback'

// defines scope of api calls
const scope = 'app-remote-control user-read-currently-playing playlist-read-private playlist-read-collaborative user-library-read user-read-email user-read-private'
const authUrl = new URL("https://accounts.spotify.com/authorize")

let accessToken: string | null = localStorage.getItem('access_token') || null
let refreshToken: string | null = localStorage.getItem('refresh_token') || null

let expiresAt: number | null = localStorage.getItem('expires_at') ? parseInt(localStorage.getItem('expires_at') || '') : null

//region # Spotify Authentication

// creates a string of random characters as a code verifier
const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
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

const redirectToSpotifyAuthorizeEndpoint = async () => {
    const codeVerifier = generateRandomString(64)

    await generateCodeChallenge(codeVerifier)
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

const exchangeToken = async (code: string) => {
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
      console.error("There was an error in exchanging the access token", error)
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
  accessToken = data.access_token
  refreshToken = data.refresh_token

  const today = new Date()
  expiresAt = today.setSeconds(today.getSeconds() + data.expires_in)

  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  localStorage.setItem('expires_at', expiresAt.toString())
}

const GetSpotifyAuthorization = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code: string | null = urlParams.get('code')

  if (code) {
    // we have received the code from Spotify and will exchange it for an accessToken
    await exchangeToken(code)
  } else if (accessToken && refreshToken && (expiresAt > Date.now())) {
    // we are authorized and reload our tokens from localStorage
    await GetUserData()
  } else {
    // we are not logged in, redirect to log in
    await redirectToSpotifyAuthorizeEndpoint()
  }
}

//endregion



export {
  exchangeToken,
  redirectToSpotifyAuthorizeEndpoint,
  GetSpotifyAuthorization,
}
