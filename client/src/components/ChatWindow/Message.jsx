import { GridItem, Flex, Text, useColorModeValue } from "@chakra-ui/react";

function Message({ message }) {
  let lightModeBgColor = "white";
  let darkModeBgColor = "gray.700";
  if (message.type === "correct") {
    lightModeBgColor = "green.300";
    darkModeBgColor = "green.700";
  } else if (message.type === "turn") {
    lightModeBgColor = "blue.300";
    darkModeBgColor = "blue.700";
  }
  let bgColor = useColorModeValue(lightModeBgColor, darkModeBgColor);

  return (
    <GridItem my="0.5" p="1" rounded="sm" bgColor={bgColor}>
      <Flex fontSize={["sm", "md"]}>
        <Flex ml="1">
          <Text fontWeight="bold">{message.username}:</Text>
        </Flex>
        <Flex ml="2">
          <Text>{message.content}</Text>
        </Flex>
      </Flex>
    </GridItem>
  );
}

export default Message;
