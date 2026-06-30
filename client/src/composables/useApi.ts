import { ref } from 'vue'

// This site ships as a static client with no backend. Every resource renders
// from its bundled fallback data, so this composable simply hands that data
// back wrapped in the same shape the components already consume.
export function useApiResource<T>(_path: string, fallback: T) {
  const data = ref<T>(fallback)
  const loading = ref(false)
  const error = ref<string | null>(null)

  return { data, loading, error }
}

// With no backend, "sending" a message means handing it to the visitor's own
// mail client pre-filled and ready to go.
export async function postContact(payload: { name: string; email: string; message: string }) {
  const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
  const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`)
  window.location.href = `mailto:branden.immerzeel@gmail.com?subject=${subject}&body=${body}`
  return { success: true, message: "Your email client should now be open with the message ready to send." }
}
