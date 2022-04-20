import { useMediaQuery } from "@chakra-ui/react";

import GameDesktop from "./GameDesktop";
import GameMobile from "./GameMobile";

function Game() {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1320px)");
  return isLargerThan1280 ? <GameDesktop /> : <GameMobile />;
}

export default Game;
