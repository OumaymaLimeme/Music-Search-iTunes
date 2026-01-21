export interface iTunesArtistResult {
  artistName: string
  collectionName: string
  artworkUrl100: string
  collectionId: number
}

export interface iTunesResponse {
  resultCount: number
  results: iTunesArtistResult[]
}

export interface iTunesAlbumDetailsResult {
  trackName: string
  trackTimeMillis: number
  collectionName: string
  collectionPrice: number
  artistName: string
}
