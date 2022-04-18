import { Flex, Image, Text } from "@chakra-ui/react";

function UserScoreItem({ user }) {
  return (
    <Flex my="2" flexDir="row" justify="space-evenly" align="center">
      <Flex>
        <Text fontSize="2xl">#1</Text>
      </Flex>
      <Image
        boxSize="3rem"
        rounded="full"
        src={user.avatar}
        alt={`${user.username}'s Avatar`}
      />
      <Flex flexDir="column">
        <Text fontSize="sm">{user.username}</Text>
        <Text fontSize="sm">Score: {user.score}</Text>
      </Flex>
    </Flex>
  );
}

export default UserScoreItem;
