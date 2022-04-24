import { Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";

function PlayerStats({ player, rank }) {
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
      key={player.id}
      flexDir="column"
      justify="center"
      align="center"
      bgGradient={bgGradient}
      rounded="md"
    >
      <Text fontSize="3xl">#{rank}</Text>
      <Image
        borderRadius="full"
        boxSize="5em"
        src={player.avatar}
        alt={`${player.name}'s Avatar`}
      />
      <Text>{player.name}</Text>
      <Text>{player.score}</Text>
    </Flex>
  );
}

export default PlayerStats;
