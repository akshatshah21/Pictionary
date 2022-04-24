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
import { PlayersContext, SocketContext, CurrentPlayerContext } from "../../App";
import SecondsTimer from "../../components/SecondsTimer";

const playersSort = (playerA, playerB) => {
  if (playerA.score && playerB.score) {
    if (playerA.score === playerB.score) {
      return playerA.id <= playerB.id ? 1 : -1;
    }
    return playerA.score > playerB.score ? -1 : 1;
  }
  return playerA.id <= playerB.id ? 1 : -1;
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

  const [isCanvasEnabled, setIsCanvasEnabled] = useState(false);

  const [hints, setHints] = useState(null);
  const [displayedHint, setDisplayedHint] = useState(null);
  const [effectsWithTime, setEffectsWithTime] = useState(null);

  const socket = useContext(SocketContext);
  const [players, setPlayers] = useContext(PlayersContext);
  const [currentPlayer, setCurrentPlayer] = useContext(CurrentPlayerContext);

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
      setTurnPlayer(currentPlayer.name);
      setTurnPlayerStatus("is choosing a word");
      onChooseWordModalOpen();
    };
    socket.on("chooseWord", onChooseWord);

    return () => socket.off("chooseWord", onChooseWord);
  }, [socket, setWordOptions, onChooseWordModalOpen, currentPlayer.name]);

  useEffect(() => {
    const onHints = (data) => {
      setHints(data);
      setTurnPlayerStatus("is drawing");
    };
    socket.on("hints", onHints);

    return () => socket.off("hints", onHints);
  }, [socket, setHints]);

  useEffect(() => {
    const effectsWithTime = {
      0: [() => console.log("Timer over")],
      10: [() => console.log("10 secs left")],
    };
    setEffectsWithTime(() => {
      hints &&
        hints.forEach((hint) => {
          const updateHint = () => setDisplayedHint(hint.hint);
          if (effectsWithTime[hint.displayTime]) {
            effectsWithTime[hint.displayTime].push(updateHint);
          } else {
            effectsWithTime[hint.displayTime] = [updateHint];
          }
        });
      return effectsWithTime;
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
    const onUpdateScore = ({
      playerId,
      playerScore,
      drawerId,
      drawerScore,
    }) => {
      setPlayers((prev) => ({
        ...prev,
        [playerId]: { ...prev[playerId], score: playerScore },
        [drawerId]: { ...prev[drawerId], score: drawerScore },
      }));

      if (playerId == currentPlayer.id) {
        setCurrentPlayer((prev) => ({
          ...prev,
          score: playerScore,
        }));
      } else if (drawerId == currentPlayer.id) {
        setCurrentPlayer((prev) => ({
          ...prev,
          score: drawerScore,
        }));
      }
    };

    socket.on("updateScore", onUpdateScore);
    return () => socket.off("updateScore", onUpdateScore);
  });

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
    const onDisableCanvas = () => setIsCanvasEnabled(false);
    socket.on("disableCanvas", onDisableCanvas);

    return () => socket.off("disableCanvas", onDisableCanvas);
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
                  key={hints}
                  duration={roundTime / 1000}
                  onComplete={() => console.log("round over")}
                  effects={effectsWithTime}
                />
              )}
            </Text>
            <Text m="auto">{displayedHint}</Text>
          </Flex>
        </GridItem>

        <GridItem h="100%">
          <Flex flexDir="column" h="100%">
            <DrawingBoard canvasEnabled={isCanvasEnabled} />
          </Flex>
        </GridItem>

        <GridItem w="100%" h="20vh">
          <Grid templateColumns="1fr 1fr" gap={2}>
            <GridItem w="100%" h="20vh">
              <UserScoreList
                users={Object.keys(players)
                  .map((id) => players[id])
                  .sort(playersSort)}
              />
            </GridItem>
            <GridItem h="20vh">
              <ChatWindow inputDisabled={turnPlayer === currentPlayer.name} />
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
            setIsCanvasEnabled(true);
            onChooseWordModalClose();
          }}
          words={wordOptions}
        />
      )}
    </>
  );
}

export default GameMobile;
