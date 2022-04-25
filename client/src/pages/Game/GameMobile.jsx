import {
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import useSound from "use-sound";
import useWindowSize from "react-use/lib/useWindowSize";

import UserScoreList from "../../components/UserScoreList";
import ChatWindow from "../../components/ChatWindow";
import ChooseWordModal from "../../components/ChooseWordModal";
import DrawingBoard from "../../components/DrawingBoard";
import { PlayersContext, SocketContext, CurrentPlayerContext } from "../../App";
import SecondsTimer from "../../components/SecondsTimer";
import PlayerStats from "../../components/PlayerStats";
import yourTurnAudio from "../../../assets/audio/your-turn.mp3";
import clockAudio from "../../../assets/audio/clock.mp3";
import hintAudio from "../../../assets/audio/hint.mp3";
import timerStartAudio from "../../../assets/audio/timer-start.mp3";

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

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const navigate = useNavigate();
  const { roomId } = useParams();

  const [playYourTurnAudio] = useSound(yourTurnAudio);
  const [playClockAudio] = useSound(clockAudio);
  const [playHintAudio] = useSound(hintAudio);
  const [playTimerStartAudio] = useSound(timerStartAudio);

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
  const {
    isOpen: isGameEndedModalOpen,
    onOpen: onGameEndedModalOpen,
    onClose: onGameEndedModalClose,
  } = useDisclosure();

  useEffect(() => {
    const onChoosing = ({ name }) => {
      setTurnPlayer(name);
      setTurnPlayerStatus("is choosing a word");
      if (name === currentPlayer.name) {
        playYourTurnAudio();
      }
    };
    socket.on("choosing", onChoosing);

    return () => socket.off("choosing", onChoosing);
  }, [socket, setTurnPlayerStatus, playYourTurnAudio, currentPlayer]);

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
      10: [() => console.log("10 secs left"), () => playClockAudio()],
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
          effectsWithTime[hint.displayTime].push(playHintAudio);
        });
      return effectsWithTime;
    });
  }, [
    hints,
    setDisplayedHint,
    setEffectsWithTime,
    playClockAudio,
    playHintAudio,
  ]);

  useEffect(() => {
    const onStartTimer = ({ time }) => {
      setRoundTime(time);
      playTimerStartAudio();
    };
    socket.on("startTimer", onStartTimer);

    return () => socket.off("startTimer", onStartTimer);
  }, [socket, setRoundTime, playTimerStartAudio]);

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
      onGameEndedModalOpen();
      setTimeout(() => {
        navigate(`/room/${roomId}/lobby`);
      }, 10000);
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

      <Modal
        isOpen={isGameEndedModalOpen}
        onClose={() => {
          onGameEndedModalClose();
          navigate(`/room/${roomId}/lobby`);
        }}
        isCentered
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Over!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gridGap="2"
            >
              {players &&
                Object.keys(players)
                  .map((id) => players[id])
                  .sort(playersSort)
                  .map((player, idx) => (
                    <PlayerStats
                      key={player.id}
                      player={player}
                      rank={idx + 1}
                    />
                  ))}
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                onGameEndedModalClose();
                navigate(`/room/${roomId}/lobby`);
              }}
            >
              Back to Lobby
            </Button>
          </ModalFooter>
        </ModalContent>
        {Object.keys(players)
          .map((id) => players[id])
          .sort(playersSort)
          .slice(0, 3)
          .findIndex((player) => player.id === currentPlayer.id) !== -1 && (
          <Confetti width={windowWidth} height={windowHeight} />
        )}
      </Modal>
    </>
  );
}

export default GameMobile;
