<script setup lang="ts">
import type { iTunesArtistResult } from '../types/iTunesSearchTypes'

defineProps<{
  items: iTunesArtistResult[]
}>()

const emit = defineEmits<{
  (e: 'row-click', albumId: number, artUrl: string, albumArtist: string): void
}>()

const headers = [
  { title: 'Album', value: 'collectionName' },
  { title: 'Artist', value: 'artistName' },
  { title: 'Cover', value: 'artworkUrl100' },
]

function onRowClick(item: iTunesArtistResult) {
  emit('row-click', item.collectionId, item.artworkUrl100, item.artistName)
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    items-per-page="10"
    hover
    @click:row="(_: any, row: { item: iTunesArtistResult }) => onRowClick(row.item)"
  >
    <template #item.artworkUrl100="{ item }">
      <v-img :src="item.artworkUrl100" max-width="100" />
    </template>
  </v-data-table>
</template>
