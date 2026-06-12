import { useRouter, useRoute } from 'vue-router'

export function useSafeBack(fallback = '/') {
  const router = useRouter()
  const route = useRoute()

  return () => {
    const prevFullPath = route.fullPath
    let timer: ReturnType<typeof setTimeout> | null = null

    router.back()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timer = setTimeout(() => {
      // 如果路径仍然相同，认为 back 失效
      if (route.fullPath === prevFullPath) {
        console.warn('[SafeBack] back failed, force fallback')
        router.replace(fallback)
      }
      timer = null
    }, 300) // 200~500ms 都行
  }
}
