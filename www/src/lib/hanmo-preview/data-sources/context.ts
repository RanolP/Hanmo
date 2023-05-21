import { nanoquery } from '@nanostores/query';

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher,
});

export function fetcher(...key: string[]): Promise<Response> {
  return fetch(key.join(''));
}
