import { useQuery } from "@tanstack/react-query";

type UseFetchResult<T, E> = {
  data: T | null;
  error: E | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => void;
};

/**
 * Fetches data from a specified API endpoint using TanStack Query.
 *
 * @template T - Type of the data returned by the API.
 * @template E - Type of the error returned by the API (default is `Error`).
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {RequestInit} [reqOpt] - Optional configuration for the fetch request.
 * @param {any[]} [deps] - Optional dependency array to trigger re-fetching when values change.
 *
 * @returns {UseFetchResult<T, E>} An object containing the fetch result and status.
 */
export function useFetch<T, E = Error>(
  url: string,
  reqOpt?: RequestInit,
  deps: any[] = [],
): UseFetchResult<T, E> {
  const {
    data,
    error,
    isPending,
    isSuccess,
    isError,
    refetch,
  } = useQuery({
    queryKey: [url, ...deps],
    queryFn: async ({ signal }) => {
      const res = await fetch(url, { ...reqOpt, signal });
      
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw result || new Error(`Failed to fetch from ${url}`);
      }
      
      return res.json() as Promise<T>;
    },
    // Maintain behavior: refetch when url or deps change
  });

  return {
    data: data ?? null,
    error: (error as E) ?? null,
    isPending,
    isSuccess,
    isError,
    refetch,
  };
}
