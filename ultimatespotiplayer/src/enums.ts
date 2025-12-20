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

interface ISpotifyExternalIdsType {
  upc: string
}

interface ISpotifyCopyrightType {
  text: string,
  type: string
}

export interface ISpotifyArtistType {
  external_urls: ISpotifyExternalUrlsType,
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}

export interface ITrackDataType {
  href: string,
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number,
  items: ISpotifyTrackType[]
}

export interface ISpotifyTrackType {
  artists: ISpotifyArtistType[],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  explicit: boolean,
  external_urls: ISpotifyExternalUrlsType,
  href: string,
  id: string,
  name: string,
  preview_url: string,
  track_number: number,
  type: string,
  uri: string,
  is_local: boolean
}

export interface IUserAlbumType {
  added_at: string,
  album: ISpotifyAlbumType
}

export interface ISpotifyAlbumType {
  album_type: string,
  total_tracks: number,
  available_markets: string[],
  external_urls: ISpotifyExternalUrlsType,
  href: string,
  id: string,
  images: ISpotifyImageType[],
  name: string,
  release_date: string,
  release_date_precision: string,
  type: string,
  uri: string,
  artists: ISpotifyArtistType[],
  tracks: ITrackDataType,
  copyrights: ISpotifyCopyrightType[],
  external_ids: ISpotifyExternalIdsType,
  genres: [],
  label: string,
  popularity: number
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

export interface IPageHeaderProps {
  spotifyUser: ISpotifyUserType
}
