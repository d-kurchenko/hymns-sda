import { usePageScroll } from 'src/shared/page-scroll';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// A cached page owns its query. Queries on other routes must never mutate it.
export function usePageSearch() {
  const route = useRoute();
  const router = useRouter();
  const path = route.path;
  const readQuery = () => typeof route.query.search === 'string' ? route.query.search : '';
  const query = ref(readQuery());
  const { scrollToTop } = usePageScroll();

  watch(() => route.fullPath, () => {
    if (route.path === path)
      query.value = readQuery();
  });

  watch(query, (search) => {
    scrollToTop();
    if (route.path === path && search !== readQuery()) {
      void router.replace({
        path,
        query: { ...route.query, search: search || undefined },
        hash: route.hash,
      });
    }
  }, { flush: 'sync' });

  return query;
}
