import {
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";

import UserScoreList from "../../components/UserScoreList";
import ChatWindow from "../../components/ChatWindow";
import ChooseWordModal from "../../components/ChooseWordModal";
import DrawingBoard from "../../components/DrawingBoard";
import { PlayersContext, SocketContext } from "../../App";
import SecondsTimer from "../../components/SecondsTimer";

const soundEffectsWithTime = {
  0: [() => console.log("Timer over")],
  10: [() => console.log("10 secs left")],
};

function GameMobile() {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const currentDrawerBgColor = useColorModeValue("blue.300", "blue.700");
  const scoreBgColor = useColorModeValue("orange.300", "orange.500");
  const headerBgColor = useColorModeValue("purple.300", "purple.700");

  const [turnPlayerStatus, setTurnPlayerStatus] = useState("");
  const [turnPlayer, setTurnPlayer] = useState("");
  const [wordOptions, setWordOptions] = useState(null);
  const [roundTime, setRoundTime] = useState(null);

  const [hints, setHints] = useState(null);
  const [displayedHint, setDisplayedHint] = useState(null);
  const [effectsWithTime, setEffectsWithTime] = useState(soundEffectsWithTime);

  const socket = useContext(SocketContext);
  const [players, setPlayers] = useContext(PlayersContext);

  useEffect(() => {
    const onChoosing = ({ name }) => {
      setTurnPlayer(name);
      setTurnPlayerStatus("is choosing a word");
    };
    socket.on("choosing", onChoosing);

    return () => socket.off("choosing", onChoosing);
  }, [socket, setTurnPlayerStatus]);

  const {
    isOpen: isChooseWordModalOpen,
    onOpen: onChooseWordModalOpen,
    onClose: onChooseWordModalClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const onChooseWord = (wordOptions) => {
      setWordOptions(wordOptions);
      onChooseWordModalOpen();
    };
    socket.on("chooseWord", onChooseWord);

    return () => socket.off("chooseWord", onChooseWord);
  }, [socket, setWordOptions, onChooseWordModalOpen]);

  useEffect(() => {
    const onHints = (data) => {
      setHints(data);
      setTurnPlayerStatus("is drawing");
    };
    socket.on("hints", onHints);

    return () => socket.off("hints", onHints);
  }, [socket, setHints]);

  useEffect(() => {
    setEffectsWithTime((effects) => {
      hints &&
        hints.forEach((hint) => {
          const updateHint = () => setDisplayedHint(hint.hint);
          if (effects[hint.displayTime]) {
            effects[hint.displayTime].push(updateHint);
          } else {
            effects[hint.displayTime] = [updateHint];
          }
        });
      return effects;
    });
  }, [hints, setDisplayedHint, setEffectsWithTime]);

  useEffect(() => {
    const onStartTimer = ({ time }) => {
      setRoundTime(time);
    };
    socket.on("startTimer", onStartTimer);

    return () => socket.off("startTimer", onStartTimer);
  }, [socket, setRoundTime]);

  useEffect(() => {
    const onLastWord = ({ word }) => {
      toast({
        title: "Round Over!",
        description: `The word was: ${word}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    };
    socket.on("lastWord", onLastWord);

    return () => socket.off("lastWord", onLastWord);
  });

  useEffect(() => {
    const onEndGame = (stats) => {
      console.log("stats", stats);
    };
    socket.on("endGame", onEndGame);

    return () => socket.off("endGame", onEndGame);
  });

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
            <Text m="auto">
              {roundTime && (
                <SecondsTimer
                  duration={roundTime / 1000}
                  onComplete={() => console.log("Round complete")}
                  effects={effectsWithTime}
                />
              )}
            </Text>
            <Text m="auto">{displayedHint}</Text>
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
