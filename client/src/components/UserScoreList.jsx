import { Flex } from "@chakra-ui/react";
import UserScoreItem from "./UserScoreItem";

function UserScoreList({ users }) {
  return (
    <Flex flexDir="column" h="100%" overflow="auto">
      {users.map((user, idx) => (
        <UserScoreItem key={user.username} user={user} rank={idx + 1} />
      ))}
    </Flex>
  );
}

export default UserScoreList;
