import {
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import UserScoreList from "../../components/UserScoreList";
import ChatWindow from "../../components/ChatWindow";
import ChooseWordModal from "../../components/ChooseWordModal";

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

function GameMobile() {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const currentDrawerBgColor = useColorModeValue("blue.300", "blue.700");
  const scoreBgColor = useColorModeValue("orange.300", "orange.500");
  const headerBgColor = useColorModeValue("purple.300", "purple.700");

  const {
    isOpen: isChooseWordModalOpen,
    onOpen: onChooseWordModalOpen,
    onClose: onChooseWordModalClose,
  } = useDisclosure();

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
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
            <Text m="auto">Canvas here</Text>
          </Flex>
        </GridItem>

        <GridItem w="100%" h="20vh">
          <Grid templateColumns="1fr 1fr" gap={2}>
            <GridItem w="100%" h="20vh">
              <UserScoreList users={dummyUsers} />
            </GridItem>
            <GridItem h="20vh">
              <ChatWindow />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <ChooseWordModal
        isOpen={isChooseWordModalOpen}
        onWordSelect={(selectedWord) => {
          console.log(selectedWord);
          // TODO submit selected word
          onChooseWordModalClose();
        }}
        words={["bob", "pop", "lolololololololololololololol"]}
      />
    </>
  );
}

export default GameMobile;
