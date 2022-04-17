import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HowToPlay from "./pages/HowToPlay";
import Play from "./pages/Play";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how" element={<HowToPlay />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
