
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";

import { Song } from "@/types";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    if (!user) return authModal.onOpen();

    const song = songs.find((song) => song.id === id);
    if (!song) return;

    player.setId(song.id);
    player.setIds(songs.map((song) => song.id));
  };

  return onPlay;
}

export default useOnPlay;