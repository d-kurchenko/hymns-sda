<script setup lang="ts">
import HomeIcon from '@material-design-icons/svg/filled/home.svg?component';
import SettingsIcon from '@material-design-icons/svg/filled/settings.svg?component';
import StarIcon from '@material-design-icons/svg/filled/star.svg?component';
import { routerModel } from 'src/modules/router';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const tabs = [
  { name: routerModel.RouteName.Main, icon: HomeIcon, label: 'navigation.main' },
  { name: routerModel.RouteName.Favorites, icon: StarIcon, label: 'navigation.favorites' },
  { name: routerModel.RouteName.Settings, icon: SettingsIcon, label: 'navigation.settings' },
];
const activeTab = computed(() => {
  if (route.name === routerModel.RouteName.Article) {
    return router.options.history.state.navigationTab === routerModel.RouteName.Favorites
      ? routerModel.RouteName.Favorites
      : routerModel.RouteName.Main;
  }

  return route.name === routerModel.RouteName.Book ? routerModel.RouteName.Main : route.name;
});
</script>

<template>
  <nav
    class="tw:fixed tw:inset-x-0 tw:bottom-0 tw:z-100 tw:grid tw:grid-cols-3 tw:gap-0! tw:h-(--bottom-nav-height) tw:pb-[env(safe-area-inset-bottom)] tw:border-t tw:border-(--outline-variant) tw:bg-(--surface-container)"
    :aria-label="$t('navigation.label')"
  >
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="tw:group tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-1 tw:w-full tw:h-full tw:min-w-0 tw:transition-colors tw:duration-240 tw:focus-visible:outline-2 tw:focus-visible:outline-(--primary) tw:focus-visible:-outline-offset-4 tw:focus-visible:rounded-xl tw:motion-reduce:transition-none"
      :class="activeTab === tab.name ? 'tw:text-(--on-secondary-container)' : 'tw:text-(--on-surface-variant)'"
      :aria-current="activeTab === tab.name ? 'page' : undefined"
    >
      <span
        class="tw:flex tw:items-center tw:justify-center tw:w-16 tw:h-8 tw:rounded-[20px] tw:transition-[background-color,scale] tw:duration-240 tw:group-active:scale-90 tw:motion-reduce:transition-none"
        :class="activeTab === tab.name ? 'tw:bg-(--secondary-container)' : 'tw:group-hover:bg-(--surface-container-highest)'"
      >
        <i><component :is="tab.icon" /></i>
      </span>
      <span class="tw:text-xs tw:leading-4">{{ $t(tab.label) }}</span>
    </RouterLink>
  </nav>
</template>
