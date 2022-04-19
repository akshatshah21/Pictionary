import { Flex, Text } from "@chakra-ui/react";
import UserScoreItem from "./UserScoreItem";

function UserScoreList({ users }) {
  return (
    <Flex flexDir="column" h="100%" w="100%" overflow="auto">
      <Text
        bgColor="tomato"
        py="1"
        border="tomato"
        rounded="md"
        textAlign="center"
        fontSize="md"
      >
        Scoreboard
      </Text>
      <Flex flexDir="column" overflow="auto">
        {users.map((user, idx) => (
          <UserScoreItem key={user.username} user={user} rank={idx + 1} />
        ))}
      </Flex>
    </Flex>
  );
}

export default UserScoreList;
