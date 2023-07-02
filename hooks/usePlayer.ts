import { create } from 'zustand';

interface PlayStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
}

const usePlayer = create<PlayStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id}),
  setIds: (ids: string[]) => set(({ ids })),
  reset: () => set(({ ids: [], activeId: undefined })),
}));


export default usePlayer;