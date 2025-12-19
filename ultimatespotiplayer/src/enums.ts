export interface ISpotifyUserType {
  country: string,
  display_name: string,
  email: string,
  explicit_content: ISpotifyExplicitContentType,
  external_urls: ISpotifyExternalUrlsType,
  followers: ISpotifyFollowersType,
  href: string,
  id: string,
  images: ISpotifyImageType[],
  product: string,
  type: string,
  uri: string
}

interface ISpotifyExplicitContentType {
  filter_enabled: boolean,
  filter_locked: boolean
}

interface ISpotifyExternalUrlsType {
  spotify: string
}

interface ISpotifyFollowersType {
  href: string,
  total: number
}

interface ISpotifyImageType {
  height: number,
  url: string,
  width: number
}

export interface ISpotifyPlaylistType {
  collaborative: boolean,
  description: string,
  external_urls: ISpotifyExternalUrlsType,
  href: string,
  id: string,
  images: ISpotifyImageType[],
  name: string,
  owner: ISpotifyUserType,
  primary_color: null,
  public: boolean,
  snapshot_id: string,
  tracks: {
    href: string,
    total: number
  },
  type: string,
  uri: string
}
