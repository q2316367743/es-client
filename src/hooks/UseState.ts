import { Ref } from 'vue'

export const useState = <T>(initial: T): [Ref<T>, (v: T) => void] => {
  const data = ref<T>(initial) as Ref<T>

  return [
    data,
    (v: T) => {
      data.value = v
    }
  ]
}

export const useBoolState = (initial: boolean, key?: string): [Ref<boolean>, () => void] => {
  const [data, setData] = useState(initial)
  if (key) {
    watch(data, (v) => localStorage.setItem(key, JSON.stringify({ value: v })))
    data.value = JSON.parse(localStorage.getItem(key) || '{}').value
  }
  return [
    data,
    () => {
      setData(!data.value)
    }
  ]
}
