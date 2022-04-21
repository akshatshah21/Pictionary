import { GridItem, Flex, Text, useColorModeValue } from "@chakra-ui/react";

function Message({ type, content, user }) {
  let lightModeBgColor = "white";
  let darkModeBgColor = "gray.700";
  if (type === "correct") {
    lightModeBgColor = "green.300";
    darkModeBgColor = "green.700";
  } else if (type === "close") {
    lightModeBgColor = "red.100";
    darkModeBgColor = "red.300";
  } else if (type === "turn") {
    lightModeBgColor = "blue.300";
    darkModeBgColor = "blue.700";
  }
  let bgColor = useColorModeValue(lightModeBgColor, darkModeBgColor);

  return (
    <GridItem my="0.5" p="1" rounded="sm" bgColor={bgColor}>
      <Flex fontSize={["sm", "md"]}>
        {user && (
          <Flex ml="1">
            <Text fontWeight="bold">{user}:</Text>
          </Flex>
        )}
        <Flex ml="2">
          <Text>{content}</Text>
        </Flex>
      </Flex>
    </GridItem>
  );
}

export default Message;
