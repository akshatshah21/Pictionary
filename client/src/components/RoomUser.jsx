import { Flex, Image, Text } from "@chakra-ui/react";

export function RoomUser({ user }) {
  return (
    <Flex flexDir="column" justify="center" align="center">
      <Image
        borderRadius="full"
        boxSize="5em"
        src={user.avatar}
        alt={`${user.name}'s Avatar`}
      />
      <Text>{user.name}</Text>
    </Flex>
  );
}
