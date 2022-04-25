import { useMediaQuery } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import useSound from "use-sound";

import { PlayersContext, SocketContext } from "../../App";
import GameDesktop from "./GameDesktop";
import GameMobile from "./GameMobile";
import exitAudio from "../../../assets/audio/exit.mp3";

function Game() {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useContext(PlayersContext);

  const [playExitAudio] = useSound(exitAudio);

  useEffect(() => {
    const onUserLeave = (player) => {
      setPlayers((prev) => {
        delete prev[player.id];
        return { ...prev }; // cryptic, but necessary, apparently
      });
      playExitAudio();
    };
    socket.on("disconnection", onUserLeave);

    return () => socket.off("disconnection", onUserLeave);
  }, [socket, playExitAudio, setPlayers]);

  const [isLargerThan1280] = useMediaQuery("(min-width: 1320px)");
  return isLargerThan1280 ? <GameDesktop /> : <GameMobile />;
}

export default Game;
