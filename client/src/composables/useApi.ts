import { onMounted, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function useApiResource<T>(path: string, fallback: T) {
  const data = ref<T>(fallback)
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const res = await fetch(`${API_BASE}${path}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      data.value = (await res.json()) as T
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
    } finally {
      loading.value = false
    }
  })

  return { data, loading, error }
}

export async function postContact(payload: { name: string; email: string; message: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as { success: boolean; message: string }
}
