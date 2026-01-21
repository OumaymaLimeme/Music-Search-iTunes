/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAlbumDetails, searchArtists } from '../iTunesSearch'

global.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('searchArtists', () => {
  it('calls the iTunes API and returns results', async () => {
    const mockResponse = {
      results: [{ collectionId: 1, collectionName: 'Test Album' }],
    }

    ;(fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    const result = await searchArtists('Adele')

    expect(fetch).toHaveBeenCalledOnce()
    expect(result).toEqual(mockResponse.results)
  })

  it('handles special characters and numbers correctly', async () => {
    const mockResponse = {
      results: [{ collectionId: 2, collectionName: 'Special Album' }],
    }

    ;(fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    const term = 'AC/DC 123'
    await searchArtists(term)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(term)))
  })

  it('returns empty array and does not call API when term is empty', async () => {
    const result = await searchArtists('   ')

    expect(fetch).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('calls the iTunes lookup API and returns songs', async () => {
    const mockResponse = {
      results: [
        { collectionId: 1, collectionName: 'Test Album' }, // first element = album info
        { trackId: 101, trackName: 'Song 1' },
        { trackId: 102, trackName: 'Song 2' },
      ],
    }

    ;(fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    const result = await fetchAlbumDetails(1)

    expect(fetch).toHaveBeenCalledOnce()
    expect(result).toEqual(mockResponse.results.slice(1))
  })
})
