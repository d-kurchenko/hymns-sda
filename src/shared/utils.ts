export function useSmartDebounceFn(
  fn: (...args: any[]) => void,
  wait = 500,
  windowMs = 1000
) {
  let changeCount = 0
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let windowResetTimer: ReturnType<typeof setTimeout> | null = null

  const wrapped = (...args: any[]) => {
    changeCount += 1

    if (changeCount === 1) {
      // Первый вызов — сразу
      fn(...args)
    } else {
      // Повторные вызовы — с debounce
      debounceTimer && clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        fn(...args)
      }, wait)
    }

    // Сбрасываем changeCount только после полной паузы
    windowResetTimer && clearTimeout(windowResetTimer)
    windowResetTimer = setTimeout(() => {
      changeCount = 0
    }, windowMs)
  }

  return wrapped
}
