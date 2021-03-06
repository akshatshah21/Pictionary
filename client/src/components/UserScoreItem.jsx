import { Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";

// TODO Blue border around currentDrawer

function UserScoreItem({ user, rank }) {
  let lightModeBgGradientStart = "white";
  let lightModeBgGradientEnd = "white";
  let darkModeBgGradientStart = "gray.700";
  let darkModeBgGradientEnd = "gray.700";
  if (rank === 1) {
    lightModeBgGradientStart = "yellow.600";
    lightModeBgGradientEnd = "yellow.300";
    darkModeBgGradientStart = "yellow.300";
    darkModeBgGradientEnd = "yellow.600";
  } else if (rank === 2) {
    lightModeBgGradientStart = "gray.300";
    lightModeBgGradientEnd = "gray.500";
    darkModeBgGradientStart = "gray.500";
    darkModeBgGradientEnd = "gray.300";
  } else if (rank === 3) {
    lightModeBgGradientStart = "yellow.700";
    lightModeBgGradientEnd = "yellow.500";
    darkModeBgGradientStart = "yellow.900";
    darkModeBgGradientEnd = "yellow.700";
  }

  const bgGradientStart = useColorModeValue(
    lightModeBgGradientStart,
    darkModeBgGradientStart
  );
  const bgGradientEnd = useColorModeValue(
    lightModeBgGradientEnd,
    darkModeBgGradientEnd
  );

  const bgGradient = `linear(to-r, ${bgGradientStart}, ${bgGradientEnd})`;

  return (
    <Flex
      mx="md:2"
      my="0.5"
      p="1"
      rounded="lg"
      flexDir="row"
      justify="flex-start"
      gap="8"
      align="center"
      bgGradient={bgGradient}
    >
      <Flex align="center">
        <Text fontSize="sm md:2xl">#{rank}</Text>
        <Image
          boxSize="3em"
          rounded="full"
          src={user.avatar}
          alt={`${user.name}'s Avatar`}
        />
      </Flex>

      <Flex flexDir="column">
        <Text fontSize="sm" isTruncated>
          {user.name}
        </Text>
        <Text fontSize="sm">Score: {user.score ? user.score : 0}</Text>
      </Flex>
    </Flex>
  );
}

export default UserScoreItem;
