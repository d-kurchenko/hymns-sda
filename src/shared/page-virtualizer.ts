import type { VirtualizerOptions } from '@tanstack/vue-virtual';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { observeElementOffset, useVirtualizer } from '@tanstack/vue-virtual';
import { useResizeObserver } from '@vueuse/core';
import { computed, onActivated, onScopeDispose, ref, toValue, watch } from 'vue';
import { usePageScroll } from './page-scroll';

type ListOptions = Pick<VirtualizerOptions<HTMLElement, HTMLElement>, 'count' | 'estimateSize' | 'getItemKey'>;

export function usePageVirtualizer(list: Ref<HTMLElement | null>, options: MaybeRefOrGetter<ListOptions>) {
  const { element, active, scrollToOffset } = usePageScroll();
  const scrollMargin = ref(0);

  function updateScrollMargin() {
    if (list.value?.isConnected && element.value?.isConnected) {
      scrollMargin.value = list.value.getBoundingClientRect().top
        - element.value.getBoundingClientRect().top + element.value.scrollTop;
    }
  }

  watch(list, updateScrollMargin, { flush: 'post' });
  useResizeObserver([element, list], updateScrollMargin);
  onActivated(updateScrollMargin);

  const observeOffset: VirtualizerOptions<HTMLElement, HTMLElement>['observeElementOffset'] = (instance, callback) => {
    // Activation has already restored/reset the DOM. Seed the observer
    // before TanStack syncs its cached offset back to the scroll element.
    callback(instance.scrollElement?.scrollTop ?? 0, false);
    return observeElementOffset(instance, callback);
  };

  const virtualizer = useVirtualizer(computed(() => {
    // Track activation in the options themselves. Reading it only inside
    // getScrollElement leaves TanStack's observers attached while cached.
    const scrollElement = active.value ? element.value : null;
    return {
      ...toValue(options),
      // Disconnect without enabled:false, which discards measurement state.
      getScrollElement: () => scrollElement,
      observeElementOffset: observeOffset,
      scrollMargin: scrollMargin.value,
      overscan: 5,
      useAnimationFrameWithResizeObserver: true,
    };
  }));

  const scroll = (offset: number, behavior: ScrollBehavior) => virtualizer.value.scrollToOffset(offset, { behavior });
  scrollToOffset.value = scroll;
  onScopeDispose(() => {
    if (scrollToOffset.value === scroll)
      scrollToOffset.value = undefined;
  });
  return virtualizer;
}
