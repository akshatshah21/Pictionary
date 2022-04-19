import {
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import UserScoreList from "../components/UserScoreList";
import ChatWindow from "../components/ChatWindow";
import ChooseWordModal from "../components/ChooseWordModal";
import { useEffect } from "react";

const dummyUsers = [
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
  {
    username: "Hades",
    avatar: "https://bit.ly/dan-abramov",
    score: 0,
  },
];

function Game() {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const currentDrawerBgColor = useColorModeValue("blue.300", "blue.700");
  const scoreBgColor = useColorModeValue("orange.300", "orange.500");
  const headerBgColor = useColorModeValue("purple.300", "purple.700");

  const {
    isOpen: isChooseWordModalOpen,
    onOpen: onChooseWordModalOpen,
    onClose: onChooseWordModalClose,
  } = useDisclosure();

  // TODO temporary; just to see how the modal looks like
  useEffect(() => {
    onChooseWordModalOpen();
  }, [onChooseWordModalOpen]);

  return (
    <Grid w="100%" h="100%" templateRows="1fr 11fr" p="2" gap="2">
      <GridItem fontSize="2xl">
        <Grid h="100%" templateColumns="2fr 7fr 3fr" gap="2">
          <GridItem h="100%">
            <Flex w="100%" h="100%" bgColor={currentDrawerBgColor} rounded="md">
              <Text textAlign="center" m="auto">
                ABC is drawing
              </Text>
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
              <Text my="auto">Time left: 21</Text>
              <Text my="auto" ml="auto" mr="auto">
                _ _ _ _ _ _ _ _
              </Text>
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
            <UserScoreList users={dummyUsers} />
          </GridItem>
          <GridItem w="100%" h="80vh"></GridItem>
          <GridItem
            w="100%"
            h="80vh"
            border="1px"
            borderRadius="md"
            borderColor={borderColor}
          >
            <ChatWindow />
          </GridItem>
        </Grid>
      </GridItem>

      <ChooseWordModal
        isOpen={isChooseWordModalOpen}
        onWordSelect={(selectedWord) => {
          console.log(selectedWord);
          // TODO submit selected word
          onChooseWordModalClose();
        }}
        words={["bob", "pop", "lolololololololololololololol"]}
      />
    </Grid>
  );
}

export default Game;
