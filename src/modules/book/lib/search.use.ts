import type { FuseResult } from 'fuse.js';
import type { MaybeRefOrGetter } from 'vue';
import type { Article } from '../model';
import { useDebounceFn } from '@vueuse/core';
import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue';
import { allArticles } from '../model';
import { useBook } from './book.use';

const WORKER_LIFE_TIME = 30_000;
let worker: Worker | null = null;
let indexedBookId: number | null | undefined;
let lastEventId = 0;
let idleTimeout: ReturnType<typeof setTimeout> | undefined;
let searchQueue: Promise<unknown> = Promise.resolve();
const pending = new Map<number, PromiseWithResolvers<FuseResult<Article>[]>>();

function terminateWorker() {
  worker?.terminate();
  worker = null;
  indexedBookId = undefined;
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

function searchInWorker(query: string, bookId?: number) {
  clearTimeout(idleTimeout);
  // The worker has one Fuse index. Keep INIT + SEARCH together so searches
  // from cached pages cannot accidentally use another book's index.
  const task = searchQueue.then(async () => {
    clearTimeout(idleTimeout);
    const scope = bookId ?? null;
    if (indexedBookId !== scope) {
      await sendCommand('INIT', { data: bookId === undefined ? allArticles : useBook(bookId).book.articles });
      indexedBookId = scope;
    }
    return sendCommand('SEARCH', { query });
  });
  searchQueue = task.catch(() => {});
  void searchQueue.then(() => {
    idleTimeout = setTimeout(terminateWorker, WORKER_LIFE_TIME);
  });
  return task;
}

export function useSearchInBooks(query: MaybeRefOrGetter<string>, bookId?: number) {
  const isLoading = ref(false);
  const resultItems = shallowRef<FuseResult<Article>[]>([]);
  let revision = 0;

  const search = useDebounceFn(async (text: string, requestRevision: number) => {
    if (requestRevision !== revision)
      return;
    try {
      const items = await searchInWorker(text, bookId);
      if (requestRevision === revision)
        resultItems.value = items;
    }
    finally {
      if (requestRevision === revision)
        isLoading.value = false;
    }
  }, 250);

  watch(() => toValue(query), (text) => {
    const requestRevision = ++revision;
    isLoading.value = !!text.trim();
    if (isLoading.value) {
      void search(text.trim(), requestRevision);
    }
    else {
      resultItems.value = [];
    }
  }, { immediate: true, flush: 'sync' });

  onScopeDispose(() => revision++);
  return { resultItems, isLoading };
}
