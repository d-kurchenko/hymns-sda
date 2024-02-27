import type { LayoutName } from '../layouts';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutName
  }
}
