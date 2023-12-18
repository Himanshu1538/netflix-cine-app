import useSwr from "swr";
import fetcher from "../lib/fetcher";

const useMovie = (id?: string) => {
  // Use SWR (React Hooks library for data fetching) to fetch movie data
  const { data, error, isLoading } = useSwr(
    // Dynamic API route based on the provided movie ID
    id ? `/api/movies/${id}` : null,
    // Custom fetcher function to make the API request
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  // Return the fetched data, error, and loading status
  return {
    data,
    error,
    isLoading,
  };
};

export default useMovie;
