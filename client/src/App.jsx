import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import Navbar from "./components/Navbar";
import Game from "./pages/Game";
import GameSettings from "./pages/GameSettings";
import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";
import Play from "./pages/Play";
import bgLight from "./bg-light.png";
import bgDark from "./bg-dark.png";
import { Flex, useColorModeValue } from "@chakra-ui/react";

export const SocketContext = createContext();

function App() {
  const bgImg = useColorModeValue(bgLight, bgDark);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`); // TODO refactor to ENV var
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <SocketContext.Provider value={socket}>
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
    </SocketContext.Provider>
  );
}

export default App;
