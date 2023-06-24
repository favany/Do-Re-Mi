import { create } from "zustand";

interface UploadModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useUploadModal = create<UploadModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUploadModal;
