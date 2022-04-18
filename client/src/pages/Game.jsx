import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import UserScoreList from "../components/UserScoreList";

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
];

function Game() {
  return (
    <Grid w="100%" h="100%" templateRows="2fr 10fr">
      <GridItem fontSize="2xl">
        <Grid h="100%" templateColumns="2fr 7fr 3fr" alignContent="stretch">
          <GridItem h="100%" border="1px">
            <Text textAlign="center">ABC is drawing</Text>
          </GridItem>
          <GridItem h="100%" border="1px">
            <Flex flexDir="row">
              <Text>Time left: 21</Text>
              <Text ml="auto" mr="auto">
                _ _ _ _ _ _ _ _
              </Text>
            </Flex>
          </GridItem>
          <GridItem h="100%" border="1px">
            <Text textAlign="center">Your Score: 2108</Text>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem>
        <Grid templateColumns="2fr 7fr 3fr">
          <GridItem border="1px">
            <UserScoreList users={dummyUsers} />
          </GridItem>
          <GridItem w="100%" h="100%" border="1px"></GridItem>
          <GridItem w="100%" h="100%" border="1px"></GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
}

export default Game;
