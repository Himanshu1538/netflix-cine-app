import { create } from "zustand";

// Interface describing the shape of the modal store state
export interface ModalStoreInterface {
  movieId?: string;
  isOpen: boolean;
  openModal: (movieId: string) => void;
  closeModal: () => void;
}

// Create a Zustand store for managing the modal state
const useInfoModalStore = create<ModalStoreInterface>((set) => ({
  // Initial movie ID is undefined
  movieId: undefined,
  // Initial state is closed
  isOpen: false,
  // Function to open the modal with a specific movie ID
  openModal: (movieId: string) => set({ isOpen: true, movieId }),
  // Function to close the modal
  closeModal: () => set({ isOpen: false, movieId: undefined }),
}));

export default useInfoModalStore;
