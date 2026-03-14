<script setup lang="ts">
import type { RouteMeta } from 'vue-router';
import ArrowBackIcon from '@material-design-icons/svg/filled/arrow_back.svg?component';
import { AnimatePresence, motion } from 'motion-v';
import { ArticleAppearanceButton } from 'src/modules/book';
import { routerModel } from 'src/modules/router';
import { SelectThemeButton } from 'src/modules/theme';
</script>

<template>
  <div class="tw:h-full tw:flex tw:flex-1 tw:flex-col tw:pb-(--safe-area-inset-bottom)]">
    <div class="tw:pt-[calc(0.5rem+var(--safe-area-inset-top))] tw:pb-2 tw:px-4 tw:flex tw:justify-between tw:items-center tw:select-none tw:sticky tw:top-0 tw:z-10 blur tw:border-b tw:border-(--outline)">
      <div class="tw:flex tw:items-center tw:overflow-hidden">
        <AnimatePresence :initial="false">
          <motion.div
            v-if="$route.name !== routerModel.RouteName.Main"
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

      <div class="tw:flex tw:gap-2">
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
        <SelectThemeButton class="tw:m-0" />
      </div>
    </div>

    <div class="page-transition-container">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition || 'slide-left' as RouteMeta['transition']">
          <div
            :key="route.path"
            class="page-transition-wrapper"
          >
            <Component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
