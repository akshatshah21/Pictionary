import {
  useColorMode,
  Switch,
  Flex,
  Button,
  IconButton,
  Fade,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Link } from "react-router-dom";

const pages = [
  { name: "Home", link: "/" },
  { name: "How to play", link: "/how" },
  { name: "Play", link: "/play" },
];

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Flex w="100%">
      <Flex w="100%" top="1rem" right="1rem" align="center">
        {/* Desktop */}
        <Flex ml="auto" display={["none", "none", "flex", "flex"]}>
          {pages.map((page) => (
            <Link to={page.link} key={page.name}>
              <Button variant="ghost" aria-label={page.name} my={4} w="100%">
                {page.name}
              </Button>
            </Link>
          ))}
        </Flex>
        <IconButton
          aria-label="Open Navbar"
          size="lg"
          mr={2}
          icon={<HamburgerIcon />}
          display={isMenuOpen ? "none" : ["flex", "flex", "none", "none"]}
          onClick={() => setIsMenuOpen(true)}
        />
        <Switch
          ml="1"
          color="green"
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
          display={isMenuOpen ? "none" : "flex"}
        />
      </Flex>

      {/* Mobile */}
      <Fade in={isMenuOpen}>
        <Flex
          w="100vw"
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          zIndex={200}
          flexDir="column"
          overflowY="auto"
          display={isMenuOpen ? "flex" : "none"}
        >
          <Flex justify="flex-end" display={["flex", "flex", "none", "none"]}>
            <IconButton
              aria-label="Close Navbar"
              size="lg"
              mr={2}
              mt={2}
              icon={<CloseIcon />}
              onClick={() => setIsMenuOpen(false)}
            />
          </Flex>
          <Flex
            flexDir="column"
            align="center"
            display={["flex", "flex", "none", "none"]}
          >
            {pages.map((page) => (
              <Link to={page.link} key={page.name}>
                <Button variant="ghost" aria-label={page.name} my={5} w="100%">
                  {page.name}
                </Button>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Fade>
    </Flex>
  );
}

export default Navbar;
