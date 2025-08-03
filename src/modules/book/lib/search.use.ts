import type { FuseResult } from 'fuse.js';
import type { MaybeRefOrGetter } from 'vue';
import type { Article } from '../model';
import { createSharedComposable, until, watchImmediate } from '@vueuse/core';
import { ref, shallowRef, toValue, watch } from 'vue';
import { allArticles } from '../model';
import { useBook } from './book.use';

const WORKER_LIFE_TIME = 30_000;

let _worker: Worker | null = null;
const promisesWithResolvers: Record<string, PromiseWithResolvers<any>> = {};
let lastEventId = 0;

const workerState = ref({
  isAllBooksInited: false,
  initedBookId: null as null | number,
  lastEventId: null as null | number,
  isInProgress: false,
  isTerminated: false,
});

function terminateWorker() {
  _worker?.terminate();
  workerState.value.initedBookId = null;
  workerState.value.isAllBooksInited = false;
  workerState.value.isTerminated = true;
}

let workerTerminationTimeout: null | NodeJS.Timeout = null;
watch(() => workerState.value.isInProgress, (isInProgress) => {
  if (!isInProgress) {
    workerTerminationTimeout = setTimeout(() => {
      if (workerState.value.isInProgress) {
        until(() => workerState.value.isInProgress)
          .toBe(false)
          .then(() => terminateWorker());
      }
      else {
        terminateWorker();
      }
    }, WORKER_LIFE_TIME);
    return;
  }

  clearTimeout(workerTerminationTimeout ?? undefined);
  workerTerminationTimeout = null;
});

function setupWorker(): Worker {
  const worker = new Worker(
    new URL('../workers/search-articles.worker.js', import.meta.url),
    {
      type: 'module',
    },
  );

  worker.onmessage = ({ data }) => {
    const { eventId, result } = data;
    promisesWithResolvers[eventId].resolve(result);
    delete promisesWithResolvers[eventId];
  };

  _worker = worker;
  workerState.value.isTerminated = false;
  return worker;
}

function getWorker(): Worker {
  const { isTerminated } = workerState.value;
  if (_worker && !isTerminated) {
    return _worker;
  }
  return setupWorker();
}

function sendCommand(command: 'INIT' | 'SEARCH', options: any) {
  const worker = getWorker();

  const eventId = lastEventId++;
  workerState.value.lastEventId = eventId;
  workerState.value.isInProgress = true;

  promisesWithResolvers[eventId] = Promise.withResolvers();
  worker.postMessage({
    command,
    eventId,
    options,
  });

  promisesWithResolvers[eventId].promise
    .then(() => {
      workerState.value.isInProgress = false;
    });

  return {
    eventId,
    promise: promisesWithResolvers[eventId].promise,
  };
}

async function sendSearchCommand(query: string, bookId?: number): Promise<{
  eventId: number
  promise: Promise<FuseResult<Article>[]>
}> {
  async function initBook(bookId: number) {
    await sendCommand('INIT', {
      data: useBook(bookId).book.articles,
    }).promise;
    workerState.value.initedBookId = bookId;
    workerState.value.isAllBooksInited = false;
  }

  async function initAllBooks() {
    await sendCommand('INIT', {
      data: allArticles,
    }).promise;
    workerState.value.initedBookId = null;
    workerState.value.isAllBooksInited = true;
  }

  const { initedBookId, isAllBooksInited } = workerState.value;

  if (bookId && (!initedBookId || initedBookId !== bookId)) {
    await initBook(bookId);
  }
  else if (!bookId && !isAllBooksInited) {
    await initAllBooks();
  }

  return sendCommand('SEARCH', {
    query,
  });
}

export const useSearchInBooks = createSharedComposable((query: MaybeRefOrGetter<string>, bookId?: number) => {
  const isLoading = ref(false);
  const resultItems = shallowRef<FuseResult<Article>[]>([]);

  let _lastSearchId: null | number = null;
  async function search() {
    isLoading.value = true;
    const { eventId, promise } = await sendSearchCommand(toValue(query).trim(), bookId);
    _lastSearchId = eventId;
    const items = await promise;
    if (_lastSearchId === eventId) {
      resultItems.value = items;
      isLoading.value = false;
    }
  }

  watchImmediate(() => toValue(query), (query) => {
    if (query.length) {
      return search();
    }
    resultItems.value = [];
    isLoading.value = false;
    _lastSearchId = -1;
  });

  return {
    resultItems,
    isLoading,
  };
});
