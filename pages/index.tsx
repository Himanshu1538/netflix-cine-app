import React from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Navbar from "../components/Navbar";
import Billboard from "../components/Billboard";
import MovieList from "../components/MovieList";
import InfoModal from "../components/InfoModal";
import useMovieList from "../hooks/useMovieList";
import useFavorites from "../hooks/useFavorites";
import useInfoModalStore from "../hooks/useInfoModalStore";

export async function getServerSideProps(context: NextPageContext) {
  // Retrieve the user's session using next-auth
  const session = await getSession(context);

  // If the user is not authenticated, redirect them to the auth page
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  // Return an object with props
  return {
    props: {},
  };
}

const Home = () => {
  // Fetch the trending movies
  const { data: movies = [] } = useMovieList();
  // Fetch the user's favorite movies
  const { data: favorites = [] } = useFavorites();
  // Access the state and functions to control visibility of InfoModal Component
  const { isOpen, closeModal } = useInfoModalStore();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
};

export default Home;
