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
import { CurrentPlayerContext, PlayersContext, SocketContext } from "../../App";
import SecondsTimer from "../../components/SecondsTimer";

const soundEffectsWithTime = {
  0: [() => console.log("Timer over")],
  10: [() => console.log("10 secs left")],
};

function GameDesktop() {
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
  const [currentPlayer] = useContext(CurrentPlayerContext);

  useEffect(() => {
    const onChoosing = ({ name }) => {
      console.log(name);
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
    <Grid w="100%" h="100%" templateRows="1fr 11fr" p="2" gap="2">
      <GridItem fontSize="2xl">
        <Grid h="100%" templateColumns="2fr 7fr 3fr" gap="2">
          <GridItem h="100%">
            <Flex w="100%" h="100%" bgColor={currentDrawerBgColor} rounded="md">
              <Text
                textAlign="center"
                m="auto"
              >{`${turnPlayer} ${turnPlayerStatus}`}</Text>
            </Flex>
          </GridItem>
          <GridItem h="100%">
            <Flex
              w="100%"
              h="100%"
              bgColor={headerBgColor}
              border="1px"
              borderRadius="md"
              borderColor={borderColor}
              px="2"
            >
              <Text my="auto">
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
            <Flex w="100%" h="100%" bgColor={scoreBgColor} rounded="md">
              <Text m="auto" textAlign="center">
                Your Score: 2108
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem>
        <Grid templateColumns="2fr 7fr 3fr" gap="2">
          <GridItem
            w="100%"
            h="80vh"
            border="1px"
            borderRadius="md"
            borderColor={borderColor}
          >
            <UserScoreList users={players} />
          </GridItem>
          <GridItem w="100%" h="80vh">
            <DrawingBoard turnPlayer={turnPlayer}/>
          </GridItem>
          <GridItem
            w="100%"
            h="80vh"
            border="1px"
            borderRadius="md"
            borderColor={borderColor}
          >
            <ChatWindow inputDisabled={turnPlayer === currentPlayer.name} />
            {/* TODO: Disable not working */}
          </GridItem>
        </Grid>
      </GridItem>

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
    </Grid>
  );
}

export default GameDesktop;
