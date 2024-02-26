import { defineStore } from "pinia";
import type { ColorScheme } from "./types";
import  { useLocalStorage, usePreferredColorScheme, watchImmediate} from '@vueuse/core'
import { LOCAL_STORAGE_COLOR_SCHEME_KEY, colorSchemes } from "./constants";
import { computed } from "vue";

export const useThemeStore = defineStore('theme', () => {
  const _preferredColorScheme =  usePreferredColorScheme()
  const preferredColorScheme = computed<ColorScheme>(() => _preferredColorScheme.value === 'no-preference' ? 'light' : _preferredColorScheme.value)

  const colorSchemeStorage = useLocalStorage(LOCAL_STORAGE_COLOR_SCHEME_KEY, preferredColorScheme.value)

  watchImmediate(colorSchemeStorage, (value) => {
    if(!(colorSchemes).includes(value as any)){
      setTimeout(() => {
        colorSchemeStorage.value = preferredColorScheme.value
      });
    }
  })

  const colorScheme = computed<ColorScheme>({
    get: () => {
      if(!colorSchemes.includes(colorSchemeStorage.value as any)){
        return preferredColorScheme.value
      } else {
        return colorSchemeStorage.value as ColorScheme
      }
    },
    set: (value) => colorSchemeStorage.value = value
  })

  const toggleColorScheme = (_colorScheme?: ColorScheme) => {
    if(_colorScheme) {
      colorScheme.value = _colorScheme
      return
    } 

    colorScheme.value = colorScheme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    preferredColorScheme,
    colorScheme,
    toggleColorScheme
  }
})
