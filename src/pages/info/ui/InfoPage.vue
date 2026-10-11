<script setup lang="ts">
import OpenInNewIcon from '@material-design-icons/svg/filled/open_in_new.svg?component';
import ScrollPage from 'src/shared/ui/ScrollPage.vue';
</script>

<template>
  <ScrollPage>
    <div class="tw:flex tw:flex-col tw:gap-4">
      <h1 class="tw:text-2xl tw:font-bold">
        {{ $t('navigation.info') }}
      </h1>
      <article class="tw:flex tw:flex-col tw:gap-4">
        <h2 class="tw:text-xl tw:font-bold">
          {{ $t('title') }}
        </h2>
        <p>{{ $t('info.description') }}</p>
        <a
          class="row ripple"
          href="https://github.com/d-kurchenko/hymns-sda"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="max">{{ $t('info.github') }}</span>
          <i><OpenInNewIcon /></i>
        </a>
      </article>
    </div>
  </ScrollPage>
</template>
