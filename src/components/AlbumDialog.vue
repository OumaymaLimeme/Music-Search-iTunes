<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { fetchAlbumDetails } from '../api/iTunesSearch'
import type { iTunesAlbumDetailsResult } from '../types/iTunesSearchTypes'

const props = defineProps<{
  albumId: number | null
  visible: boolean
  albumArtUrl: string
}>()

const emit = defineEmits(['update:visible'])

const tracks = ref<iTunesAlbumDetailsResult[]>([])
const loading = ref(false)
const albumArtist = ref('')

watch(
  () => props.albumId,
  async (id) => {
    if (!id) return
    loading.value = true
    tracks.value = await fetchAlbumDetails(id)
    albumArtist.value = tracks.value[0]?.artistName || ''

    loading.value = false
  },
)

function msToMinutes(ms: number) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const totalRuntime = computed(() =>
  msToMinutes(tracks.value.reduce((s, t) => s + t.trackTimeMillis, 0)),
)
</script>

<template>
  <v-dialog :model-value="visible" max-width="600">
    <v-card>
      <v-card-title>Album by {{ albumArtist }}</v-card-title>

      <v-card-text>
        <v-img v-if="albumArtUrl" :src="albumArtUrl" max-width="300" class="mb-4" />

        <v-progress-linear v-if="loading" indeterminate />

        <v-list>
          <v-list-item v-for="t in tracks" :key="t.trackName">
            <v-list-item-title>{{ t.trackName }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ msToMinutes(t.trackTimeMillis) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <div v-if="tracks.length" class="mt-4">
          Total runtime: <strong>{{ totalRuntime }}</strong>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:visible', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
