import useSwr from "swr";

import fetcher from "../lib/fetcher";

const useCurrentUser = () => {
  // Fetch user data using the /api/current endpoint
  const { data, error, isLoading, mutate } = useSwr("/api/current", fetcher);
  return {
    data,
    error,
    isLoading,
    // Function to manually trigger a data re-fetch
    mutate,
  };
};

export default useCurrentUser;
