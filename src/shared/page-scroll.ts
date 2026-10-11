import type { InjectionKey, Ref } from 'vue';
import { inject, onActivated, onDeactivated, provide, ref, shallowRef } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { RouteName } from '../modules/router/model';

export interface PageScroll {
  element: Ref<HTMLElement | null>
  y: Ref<number>
  active: Ref<boolean>
  scrollToOffset: Ref<((_offset: number, _behavior: ScrollBehavior) => void) | undefined>
  scrollToTop: (_behavior?: ScrollBehavior) => void
}

export const pageScrollKey: InjectionKey<PageScroll> = Symbol('page-scroll');

export function usePageScroll() {
  const scroll = inject(pageScrollKey);
  if (!scroll)
    throw new Error('Scrollable content must be inside ScrollPage');
  return scroll;
}

export function providePageScroll() {
  const element = ref<HTMLElement | null>(null);
  const y = ref(0);
  const active = ref(true);
  const scrollToOffset = shallowRef<((_offset: number, _behavior: ScrollBehavior) => void)>();
  let savedOffset = 0;

  function scrollToTop(behavior: ScrollBehavior = 'instant') {
    if (behavior !== 'smooth')
      y.value = 0;
    if (scrollToOffset.value)
      scrollToOffset.value(0, behavior);
    else
      element.value?.scrollTo({ top: 0, behavior });
  }

  const state = { element, y, active, scrollToTop, scrollToOffset };
  provide(pageScrollKey, state);

  onBeforeRouteLeave((to) => {
    // Preserve a list only while reading a song opened from it. Navigating
    // between tabs or leaving a collection starts the next visit at the top.
    savedOffset = to.name === RouteName.Article ? element.value?.scrollTop ?? 0 : 0;
  });
  onBeforeRouteUpdate((to, from) => {
    if (to.path !== from.path)
      savedOffset = 0;
  });

  onActivated(() => {
    // Restore/reset the DOM before reconnecting the virtualizer's observers.
    y.value = savedOffset;
    element.value?.scrollTo({ top: savedOffset, behavior: 'instant' });
    active.value = true;
  });
  onDeactivated(() => active.value = false);

  function onScroll() {
    if (active.value && element.value?.isConnected)
      y.value = element.value.scrollTop;
  }

  return { ...state, onScroll };
}
