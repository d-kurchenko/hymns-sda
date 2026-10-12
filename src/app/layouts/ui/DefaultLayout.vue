<script setup lang="ts">
import type { RouteMeta } from 'vue-router';
import ArrowBackIcon from '@material-design-icons/svg/filled/arrow_back.svg?component';
import { AnimatePresence, motion } from 'motion-v';
import { ArticleAppearanceButton, BookLanguagesButton } from 'src/modules/book';
import { routerModel } from 'src/modules/router';
import { SelectThemeButton } from 'src/modules/theme';
import BottomNavbar from './BottomNavbar.vue';
</script>

<template>
  <div class="tw:relative tw:h-full tw:min-h-0 tw:flex tw:flex-1 tw:flex-col tw:pb-(--bottom-nav-height) tw:bg-(--surface)">
    <div class="tw:h-(--app-header-height) tw:pt-[calc(0.5rem+env(safe-area-inset-top))] tw:pb-2 tw:px-4 tw:flex tw:justify-between tw:items-center tw:select-none tw:sticky tw:top-0 tw:z-30 blur tw:border-b tw:border-(--outline)">
      <div class="tw:flex tw:items-center tw:overflow-hidden">
        <AnimatePresence :initial="false">
          <motion.div
            v-if="$route.name === routerModel.RouteName.Book || $route.name === routerModel.RouteName.Article"
            class="circle ripple tw:h-10 tw:w-10 tw:mr-2 tw:flex tw:justify-center tw:items-center tw:overflow-hidden tw:cursor-pointer tw:shrink-0"
            :variants="{
              hidden: { opacity: 0, transform: 'translateX(-8px) scale(0.5)', width: '0px', height: '0px', marginRight: '0px' },
              visible: { opacity: 1, transform: 'translateX(0) scale(1)', width: '40px', height: '40px', marginRight: '8px' },
            }"
            initial="hidden"
            animate="visible"
            exit="hidden"
            :transition="{ duration: 0.2 }"
            @click="$router.back()"
          >
            <i><ArrowBackIcon /></i>
          </motion.div>
        </AnimatePresence>

        <div class="tw:text-2xl tw:font-extrabold tw:italic tw:truncate tw:max-[330px]:text-xl">
          {{ $t('title') }}
        </div>
      </div>

      <div class="tw:flex tw:shrink-0 tw:gap-2">
        <AnimatePresence :initial="false">
          <motion.div
            v-if="$route.name === routerModel.RouteName.Article"
            key="article-appearance"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2 }"
          >
            <ArticleAppearanceButton />
          </motion.div>
        </AnimatePresence>
        <BookLanguagesButton
          v-if="$route.name === routerModel.RouteName.Main"
          icon-only
          align-end
        />
        <SelectThemeButton class="tw:m-0" />
      </div>
    </div>

    <div class="page-transition-container">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition || 'slide-left' as RouteMeta['transition']">
          <KeepAlive :include="['MainPage', 'BookPage', 'FavoritesPage']">
            <Component
              :is="Component"
              :key="route.path"
            />
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
    <BottomNavbar />
  </div>
</template>
