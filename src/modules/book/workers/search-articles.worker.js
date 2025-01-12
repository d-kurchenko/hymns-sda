import Fuse from 'fuse.js';

let fuse;

onmessage = function (event) {
  const { command, eventId, options } = event.data;

  if (command === 'INIT') {
    const { data } = options;

    fuse = new Fuse(data, {
      isCaseSensitive: false,
      includeMatches: true,
      keys: [
        {
          name: 'title',
          weight: 1,
        },
        {
          name: 'plainContent',
        },
      ],
      threshold: 0.3,
      distance: 10000,
    });

    postMessage({ eventId });
  }
  else if (command === 'SEARCH') {
    const { query } = options;
    const result = fuse.search(query);
    postMessage({ eventId, result });
  }
};
