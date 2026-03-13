import { defineAsyncComponent } from 'vue';

export { default as DefaultLayout } from './DefaultLayout.vue';
export const EmptyLayout = defineAsyncComponent(() => import('./EmptyLayout.vue'));
