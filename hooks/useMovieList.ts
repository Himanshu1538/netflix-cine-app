import useSwr from "swr";
import fetcher from "../lib/fetcher";

const useMovieList = () => {
  // Use SWR for data fetching
  const { data, error, isLoading } = useSwr("/api/movies", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
  };
};

export default useMovieList;
