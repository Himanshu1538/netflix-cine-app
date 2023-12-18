import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

import useCurrentUser from "../hooks/useCurrentUser";
import useFavorites from "../hooks/useFavorites";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  // Custom hooks to manage user data and favorites
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  // Memoized value indicating whether the movie is in the user's favorites
  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(movieId);
  }, [currentUser, movieId]);

  // Function to toggle favorites
  const toggleFavorites = useCallback(async () => {
    let response;

    // Check if the movie is already in favorites
    if (isFavorite) {
      // Remove the movie from favorites
      response = await axios.delete("/api/favorite", { data: { movieId } });
    } else {
      // Add the movie to favorites
      response = await axios.post("/api/favorite", { movieId });
    }

    // Update the favoriteIds in the user data
    const updatedFavoriteIds = response?.data?.favoriteIds;
    mutate({
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });

    // Refresh the favorites list
    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? CheckIcon : PlusIcon;

  return (
    <div
      onClick={toggleFavorites}
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
    >
      <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
  );
};

export default FavoriteButton;
