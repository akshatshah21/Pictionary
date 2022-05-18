import {
  Flex,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Button,
  Heading,
  Select,
  Textarea,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSound from "use-sound";

import { CurrentPlayerContext, PlayersContext, SocketContext } from "../App";
import { RoomUser } from "../components/RoomUser";
import { SliderThumbWithTooltip } from "../components/SliderThumbWithTooltip";
import exitAudio from "../../assets/audio/exit.mp3";
import joinAudio from "../../assets/audio/pop.mp3";

const LANGUAGES = [
  { value: "english", name: "English" },
  { value: "hindi", name: "Hindi" },
];
const DEFAULT_CUSTOM_WORDS_PROB = 5; // percent
const DEFAULT_ROUNDS = 5;
const DEFAULT_ROUND_TIME = 60; // seconds
const DEFAULT_LANGUAGE = { value: "english", name: "English" };

function GameSettings() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.900");
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);

  const { roomId } = useParams();

  const [customWordsText, setCustomWordsText] = useState("");
  const [customWordsProb, setCustomWordsProb] = useState(
    DEFAULT_CUSTOM_WORDS_PROB / 100
  );

  const socket = useContext(SocketContext);
  const [currentPlayer] = useContext(CurrentPlayerContext);
  const [players, setPlayers] = useContext(PlayersContext);

  const [playExitAudio] = useSound(exitAudio);
  const [playJoinAudio] = useSound(joinAudio);

  useEffect(() => {
    socket.once("otherPlayers", (otherPlayers) => {
      setPlayers(() => {
        const players = {
          [currentPlayer.id]: currentPlayer,
        };
        otherPlayers.forEach((player) => {
          players[player.id] = player;
        });

        return players;
      });
    });

    function onPlayerJoin(player) {
      setPlayers((prev) => ({ ...prev, [player.id]: player }));
      playJoinAudio();
    }

    socket.on("joinRoom", onPlayerJoin);

    return () => socket.off("joinRoom", onPlayerJoin);
  }, [socket, setPlayers, currentPlayer, playJoinAudio]);

  useEffect(() => {
    const onUserLeave = (player) => {
      setPlayers((prev) => {
        delete prev[player.id];
        return { ...prev }; // cryptic, but necessary, apparently
      });
      playExitAudio();
    };
    socket.on("disconnection", onUserLeave);

    return () => socket.off("disconnection", onUserLeave);
  }, [socket, playExitAudio, setPlayers]);

  useEffect(() => {
    if (currentPlayer.isAdmin) {
      socket.emit("settingsUpdate", {
        rounds,
        time: roundTime * 1000,
        probability: customWordsProb,
        customWords: customWordsText.replace(/\s+/g, " ").trim().split(" "),
        language: language,
      });
    }
  }, [
    socket,
    currentPlayer,
    rounds,
    roundTime,
    customWordsProb,
    customWordsText,
    language,
  ]);

  useEffect(() => {
    function onSettingsUpdate(data) {
      console.log(data);
      setRounds(data.rounds);
      setRoundTime(data.time / 1000);
      setCustomWordsProb(data.probability);
      setLanguage(data.language);
    }

    socket.on("settingsUpdate", onSettingsUpdate);

    return () => socket.off("settingsUpdate", onSettingsUpdate);
  }, [socket, setRounds, setRoundTime, setCustomWordsProb, setLanguage]);

  const { roomId: roomCode } = useParams();
  useEffect(() => {
    socket.once("startGame", () => {
      navigate(`/room/${roomCode}/`);
    });
  }, [socket, navigate, roomCode]);

  return (
    <Flex h={["100%", "100%", "75vh"]} marginTop="10vh" justifyContent="center">
      <SimpleGrid
        columns={["1", "1", "2"]}
        gridGap="4"
        w={["95vw", "85vw", "60vw"]}
        bgColor={bgColor}
        p="8"
        rounded="md"
      >
        <GridItem w="100%" h="90%">
          <Flex flexDir="column">
            <Heading>Room Code: {roomId}</Heading>
            <FormControl>
              <Flex justify="space-between" my="2">
                <FormLabel htmlFor="rounds" w="xs">
                  Number of Rounds: {rounds}
                </FormLabel>
                <SliderThumbWithTooltip
                  initialValue={DEFAULT_ROUNDS}
                  min={1}
                  max={10}
                  step={1}
                  isDisabled={!currentPlayer.isAdmin}
                  onChangeEnd={(value) => setRounds(Number(value))}
                />
              </Flex>
              <Flex justify="space-between" my="2">
                <FormLabel htmlFor="seconds" w="xs">
                  Seconds per Round: {roundTime}
                </FormLabel>
                <SliderThumbWithTooltip
                  initialValue={DEFAULT_ROUND_TIME}
                  min={10}
                  max={100}
                  step={10}
                  isDisabled={!currentPlayer.isAdmin}
                  onChangeEnd={(value) => setRoundTime(Number(value))}
                />
              </Flex>
              <Flex justify="space-between" my="2">
                <FormLabel>Language</FormLabel>
                <Select
                  isDisabled={!currentPlayer.isAdmin}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.name}
                    </option>
                  ))}
                </Select>
              </Flex>

              <Flex my="4">
                <FormLabel>Custom Words</FormLabel>
                <Textarea
                  isDisabled={!currentPlayer.isAdmin}
                  value={customWordsText}
                  onChange={(e) => setCustomWordsText(e.target.value)}
                  placeholder="supercalifragilisticexpialidocious sesquipedalophobia hippopotomonstrosesquippedaliophobia bob"
                  rows={5}
                  resize="none"
                />
              </Flex>
              <FormLabel>Probability of Custom Words</FormLabel>
              <SliderThumbWithTooltip
                initialValue={DEFAULT_CUSTOM_WORDS_PROB}
                min={0}
                max={100}
                step={5}
                sliderMarks={[25, 50, 75]}
                isDisabled={!currentPlayer.isAdmin}
                onChangeEnd={(percent) => setCustomWordsProb(percent / 100)}
              />
              {currentPlayer.isAdmin && (
                <Button
                  my="4"
                  w="100%"
                  onClick={() => {
                    // console.log("Start game");
                    socket.emit("startGame");
                    // TODO Start game
                  }}
                >
                  Start Game
                </Button>
              )}
            </FormControl>
          </Flex>
        </GridItem>
        <GridItem w="100%" h="90%" overflow="auto">
          <Grid templateColumns="repeat(4, 1fr)" gridGap="2">
            {players &&
              Object.keys(players).map((id) => (
                <RoomUser key={id} user={players[id]} />
              ))}
          </Grid>
        </GridItem>

        {/* TODO Share link */}
      </SimpleGrid>
    </Flex>
  );
}

export default GameSettings;
