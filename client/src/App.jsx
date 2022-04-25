import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Flex, useColorModeValue } from "@chakra-ui/react";

import Navbar from "./components/Navbar";
import Game from "./pages/Game";
import GameSettings from "./pages/GameSettings";
import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";
import Play from "./pages/Play";
import bgLight from "../assets/img/bg-light.png";
import bgDark from "../assets/img/bg-dark.png";

export const SocketContext = createContext();
export const PlayersContext = createContext();
export const CurrentPlayerContext = createContext();

function App() {
  const bgImg = useColorModeValue(bgLight, bgDark);
  const [socket, setSocket] = useState(null);
  const currentPlayerState = useState(null);
  const playersState = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`); // TODO refactor to ENV var
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <SocketContext.Provider value={socket}>
      <PlayersContext.Provider value={currentPlayerState}>
        <CurrentPlayerContext.Provider value={playersState}>
          <BrowserRouter>
            <Flex flexDir="column" h="100vh" bgImage={bgImg}>
              <Navbar />

              <Routes>
                <Route path="/" element={<Play />} />
                <Route path="/how" element={<HowToPlay />} />
                <Route path="/play" element={<Play />} />
                <Route path="/room/:roomId" element={<Game />} />
                <Route path="/room/:roomId/lobby" element={<GameSettings />} />
              </Routes>
            </Flex>
          </BrowserRouter>
        </CurrentPlayerContext.Provider>
      </PlayersContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
