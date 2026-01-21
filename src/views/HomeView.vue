<script setup lang="ts">
import { ref } from 'vue'
import { searchArtists } from '../api/iTunesSearch'
import type { iTunesArtistResult } from '../types/iTunesSearchTypes'
import DataTable from '../components/DataTable.vue'
import AlbumDialog from '../components/AlbumDialog.vue'

const artist = ref('')
const results = ref<iTunesArtistResult[]>([])
const loading = ref(false)

const dialogVisible = ref(false)
const selectedAlbumId = ref<number | null>(null)
const selectedAlbumArt = ref('')
const selectedAlbumArtist = ref('')
const formValid = ref(false)

async function onSearch() {
  if (!artist.value) return

  loading.value = true
  try {
    results.value = await searchArtists(artist.value)
  } finally {
    loading.value = false
  }
}

function onRowClick(albumId: number, artUrl: string, albumArtist: string) {
  selectedAlbumId.value = albumId
  selectedAlbumArt.value = artUrl
  selectedAlbumArtist.value = albumArtist
  dialogVisible.value = true
}
</script>

<template>
  <v-container class="py-8">
    <v-card class="pa-6 mx-auto" max-width="600">
      <h2 class="mb-4">🎵 Search Music by Artist</h2>

      <v-form v-model="formValid" @submit.prevent="onSearch">
        <v-text-field
          v-model="artist"
          label="Artist name"
          prepend-inner-icon="mdi-account-music"
          variant="outlined"
          :rules="[(v) => !!v || 'Artist name is required']"
          required
        />

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-4"
          :loading="loading"
          :disabled="!formValid"
        >
          Search
        </v-btn>
      </v-form>
    </v-card>

    <DataTable class="mt-8" :items="results" @row-click="onRowClick" />

    <AlbumDialog
      :album-id="selectedAlbumId"
      :album-art-url="selectedAlbumArt"
      :albulm-artist="selectedAlbumArtist"
      v-model:visible="dialogVisible"
    />
  </v-container>
</template>
