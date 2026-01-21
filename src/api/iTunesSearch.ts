import type {
  iTunesArtistResult,
  iTunesAlbumDetailsResult,
  iTunesResponse,
} from '../types/iTunesSearchTypes'

export async function searchArtists(term: string): Promise<iTunesArtistResult[]> {
  if (!term.trim()) return []

  const url = `/api/search?term=${encodeURIComponent(term)}&entity=album` // <- proxy

  const response = await fetch(url)
  const data: iTunesResponse = await response.json()

  return data.results ?? []
}

export async function fetchAlbumDetails(collectionId: number): Promise<iTunesAlbumDetailsResult[]> {
  const url = `/api/lookup?id=${collectionId}&entity=song` // <- proxy
  const response = await fetch(url)
  const data = await response.json()

  return data.results.slice(1)
}
