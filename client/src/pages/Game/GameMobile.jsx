import {
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";

import UserScoreList from "../../components/UserScoreList";
import ChatWindow from "../../components/ChatWindow";
import ChooseWordModal from "../../components/ChooseWordModal";
import DrawingBoard from "../../components/DrawingBoard";
import { PlayersContext, SocketContext } from "../../App";

function GameMobile() {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const currentDrawerBgColor = useColorModeValue("blue.300", "blue.700");
  const scoreBgColor = useColorModeValue("orange.300", "orange.500");
  const headerBgColor = useColorModeValue("purple.300", "purple.700");

  const [turnPlayerStatus, setTurnPlayerStatus] = useState("");
  const [turnPlayer, setTurnPlayer] = useState("");
  const [wordOptions, setWordOptions] = useState(null);

  const [hints, setHints] = useState(null);

  const socket = useContext(SocketContext);
  const [players, setPlayers] = useContext(PlayersContext);

  useEffect(() => {
    const onChoosing = ({ name }) => {
      console.log(name);
      setTurnPlayer(name);
      setTurnPlayerStatus(`is choosing a word`);
    };
    socket.on("choosing", onChoosing);

    return () => socket.off("choosing", onChoosing);
  }, [socket, setTurnPlayerStatus]);

  const {
    isOpen: isChooseWordModalOpen,
    onOpen: onChooseWordModalOpen,
    onClose: onChooseWordModalClose,
  } = useDisclosure();

  useEffect(() => {
    const onChooseWord = (wordOptions) => {
      setWordOptions(wordOptions);
      onChooseWordModalOpen();
    };
    socket.on("chooseWord", onChooseWord);

    return () => socket.off("chooseWord", onChooseWord);
  }, [socket, setWordOptions, onChooseWordModalOpen]);

  useEffect(() => {
    socket.on("hints", (data) => console.log(data));
  }, [socket]);

  return (
    <>
      <Grid w="100%" h="60vh" templateRows="1fr 7fr 4fr" gap="2">
        <GridItem fontSize="lg" h="100%">
          <Flex
            flexDir="column"
            w="100%"
            h="100%"
            bgColor={headerBgColor}
            border="1px"
            borderRadius="md"
            borderColor={borderColor}
            px="2"
          >
            <Text m="auto">Time left: 21</Text>
            <Text m="auto">_ _ _ _ _ _ _ _</Text>
          </Flex>
        </GridItem>

        <GridItem h="100%">
          <Flex flexDir="column" h="100%">
            <DrawingBoard />
          </Flex>
        </GridItem>

        <GridItem w="100%" h="20vh">
          <Grid templateColumns="1fr 1fr" gap={2}>
            <GridItem w="100%" h="20vh">
              <UserScoreList users={players} />
            </GridItem>
            <GridItem h="20vh">
              <ChatWindow />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      {wordOptions && (
        <ChooseWordModal
          isOpen={isChooseWordModalOpen}
          onWordSelect={(selectedWord) => {
            console.log(selectedWord);
            socket.emit("chooseWord", { word: selectedWord });
            onChooseWordModalClose();
          }}
          words={wordOptions}
        />
      )}
    </>
  );
}

export default GameMobile;
