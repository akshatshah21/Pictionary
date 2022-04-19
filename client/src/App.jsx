import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Game from "./pages/Game";
import GameSettings from "./pages/GameSettings";
import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";
import Play from "./pages/Play";
import bgLight from "./bg-light.png";
import bgDark from "./bg-dark.png";
import { Flex, useColorModeValue } from "@chakra-ui/react";

function App() {
  const bgImg = useColorModeValue(bgLight, bgDark);

  return (
    <BrowserRouter>
      <Flex flexDir="column" h="100vh" bgImage={bgImg}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how" element={<HowToPlay />} />
          <Route path="/play" element={<Play />} />
          <Route path="/room/:roomId" element={<Game />} />
          <Route path="/room/:roomId/settings" element={<GameSettings />} />
        </Routes>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
