import {
  Flex,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { RoomUser } from "../components/RoomUser";
import { SliderThumbWithTooltip } from "../components/SliderThumbWithTooltip";

const LANGUAGES = [
  { value: "en", name: "English" },
  { value: "de", name: "German" },
  { value: "hi", name: "Hindi" },
];
const DEFAULT_CUSTOM_WORDS_PROB = 5; // percent
const DEFAULT_ROUNDS = 5;
const DEFAULT_ROUND_TIME = 60; // seconds
const DEFAULT_LANGUAGE = { value: "en", name: "English" };

function GameSettings() {
  const [users, setUsers] = useState([
    { username: "Hades", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hermione", avatar: "https://bit.ly/dan-abramov" },
    { username: "leo", avatar: "https://bit.ly/dan-abramov" },
    { username: "Crayon", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
    { username: "Hitman", avatar: "https://bit.ly/dan-abramov" },
  ]);
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE.value);

  const [customWordsText, setCustomWordsText] = useState("");
  const [customWordsProb, setCustomWordsProb] = useState(
    DEFAULT_CUSTOM_WORDS_PROB / 100
  );

  // TODO probably add listener for joinRoom to update users
  // TODO probably add listener for leaveRoom to update users
  // TODO Update game settings at backend

  return (
    <Flex h="85vh" marginTop="10vh" justifyContent="center">
      <Grid templateRows="4fr 1fr" templateColumns="repeat(2, 1fr)" gridGap="4">
        <GridItem w="100%" h="100%">
          <Flex flexDir="column">
            <FormControl>
              <Flex justify="space-between" my="4">
                <FormLabel htmlFor="rounds">Number of Rounds</FormLabel>
                <NumberInput
                  allowMouseWheel
                  defaultValue={DEFAULT_ROUNDS}
                  min={1}
                  step={1}
                  value={rounds}
                  onChange={(value) => setRounds(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <Flex justify="space-between" my="4">
                <FormLabel htmlFor="seconds">Seconds per Round</FormLabel>
                <NumberInput
                  allowMouseWheel
                  defaultValue={DEFAULT_ROUND_TIME}
                  min={10}
                  max={120}
                  step={10}
                  value={roundTime}
                  onChange={(value) => setRoundTime(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <Flex justify="space-between" my="4">
                <FormLabel>Language</FormLabel>
                <Select
                  defaultValue={DEFAULT_LANGUAGE.value}
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
                  value={customWordsText}
                  onChange={(e) => setCustomWordsText(e.target.value)}
                  placeholder="supercalifragilisticexpialidocious sesquipedalophobia hippopotomonstrosesquippedaliophobia bob"
                  rows={10}
                  resize="none"
                />
              </Flex>
              <FormLabel>Probability of Custom Words</FormLabel>
              <SliderThumbWithTooltip
                initialValue={DEFAULT_CUSTOM_WORDS_PROB}
                onChangeEnd={(percent) => setCustomWordsProb(percent / 100)}
              />

              <Button
                my="4"
                w="100%"
                onClick={() => {
                  console.log("Start game");
                  // TODO Start game
                }}
              >
                Start Game
              </Button>
            </FormControl>
          </Flex>
        </GridItem>
        <GridItem w="100%" h="100%" overflow="auto">
          <Grid templateColumns="repeat(4, 1fr)" gridGap="2">
            {users.map((user) => (
              <RoomUser key={user.username} user={user} />
            ))}
          </Grid>
        </GridItem>

        <GridItem w="100%" h="100%" colSpan="2">
          Share link
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default GameSettings;
