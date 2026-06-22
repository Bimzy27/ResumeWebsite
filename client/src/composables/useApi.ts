import { onMounted, ref } from 'vue'

// Unset unless explicitly provided at build time (e.g. when a backend is
// actually deployed). The production deployment of this site is the static
// client only, with no API behind it, so by default there's nothing to call
// and every resource just uses its bundled fallback data immediately.
const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined

export function useApiResource<T>(path: string, fallback: T) {
  const data = ref<T>(fallback)
  const loading = ref(!!API_BASE)
  const error = ref<string | null>(null)

  if (API_BASE) {
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
  }

  return { data, loading, error }
}

// With no backend deployed, "sending" a message means handing it to the
// visitor's own mail client pre-filled and ready to go, rather than POSTing
// to an API that doesn't exist in production.
export async function postContact(payload: { name: string; email: string; message: string }) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return (await res.json()) as { success: boolean; message: string }
  }

  const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
  const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`)
  window.location.href = `mailto:branden.immerzeel@gmail.com?subject=${subject}&body=${body}`
  return { success: true, message: "Your email client should now be open with the message ready to send." }
}
