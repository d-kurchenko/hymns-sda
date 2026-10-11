import type { FuseResult } from 'fuse.js';
import type { MaybeRefOrGetter } from 'vue';
import type { Article, BookLanguage } from '../model';
import { useDebounceFn } from '@vueuse/core';
import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue';
import { BOOK_LANGUAGES, books } from '../model';
import { useBook } from './book.use';

const WORKER_LIFE_TIME = 30_000;
let worker: Worker | null = null;
let indexedScope: string | undefined;
let lastEventId = 0;
let idleTimeout: ReturnType<typeof setTimeout> | undefined;
let searchQueue: Promise<unknown> = Promise.resolve();
const pending = new Map<number, PromiseWithResolvers<FuseResult<Article>[]>>();

function terminateWorker() {
  worker?.terminate();
  worker = null;
  indexedScope = undefined;
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('../workers/search-articles.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      pending.get(data.eventId)?.resolve(data.result);
      pending.delete(data.eventId);
    };
    worker.onerror = (event) => {
      for (const request of pending.values())
        request.reject(new Error(event.message));
      pending.clear();
      terminateWorker();
    };
  }
  return worker;
}

function sendCommand(command: 'INIT' | 'SEARCH', options: object) {
  const eventId = lastEventId++;
  const request = Promise.withResolvers<FuseResult<Article>[]>();
  pending.set(eventId, request);
  getWorker().postMessage({ command, eventId, options });
  return request.promise;
}

function searchInWorker(query: string, bookId: number | undefined, languages: readonly BookLanguage[]) {
  clearTimeout(idleTimeout);
  // The worker has one Fuse index. Keep INIT + SEARCH together so searches
  // from cached pages cannot accidentally use another search scope's index.
  const task = searchQueue.then(async () => {
    clearTimeout(idleTimeout);
    const scope = bookId === undefined ? `languages:${languages.join(',')}` : `book:${bookId}`;
    if (indexedScope !== scope) {
      const data = bookId === undefined
        ? books.filter(book => languages.includes(book.language)).flatMap(book => book.articles)
        : useBook(bookId).book.articles;
      await sendCommand('INIT', { data });
      indexedScope = scope;
    }
    return sendCommand('SEARCH', { query });
  });
  searchQueue = task.catch(() => {});
  void searchQueue.then(() => {
    idleTimeout = setTimeout(terminateWorker, WORKER_LIFE_TIME);
  });
  return task;
}

interface SearchOptions {
  bookId?: number
  languages?: MaybeRefOrGetter<readonly BookLanguage[]>
}

export function useSearchInBooks(query: MaybeRefOrGetter<string>, options: SearchOptions = {}) {
  const isLoading = ref(false);
  const resultItems = shallowRef<FuseResult<Article>[]>([]);
  let revision = 0;
  const getLanguages = () => options.languages ? toValue(options.languages) : BOOK_LANGUAGES;

  const search = useDebounceFn(async (text: string, languages: readonly BookLanguage[], requestRevision: number) => {
    if (requestRevision !== revision)
      return;
    try {
      const items = await searchInWorker(text, options.bookId, languages);
      if (requestRevision === revision)
        resultItems.value = items;
    }
    finally {
      if (requestRevision === revision)
        isLoading.value = false;
    }
  }, 250);

  watch([
    () => toValue(query),
    () => getLanguages().join(','),
  ], ([text, languageScope], [, previousLanguageScope]) => {
    const requestRevision = ++revision;
    if (languageScope !== previousLanguageScope)
      resultItems.value = [];
    isLoading.value = !!text.trim();
    if (isLoading.value) {
      const selectedLanguages = BOOK_LANGUAGES.filter(language => getLanguages().includes(language));
      void search(text.trim(), selectedLanguages, requestRevision);
    }
    else {
      resultItems.value = [];
    }
  }, { immediate: true, flush: 'sync' });

  onScopeDispose(() => revision++);
  return { resultItems, isLoading };
}
