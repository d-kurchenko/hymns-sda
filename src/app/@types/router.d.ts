
import 'vue-router'
import type { LayoutName } from '../layouts'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutName
  }
}
