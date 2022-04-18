import { Flex } from "@chakra-ui/react";
import UserScoreItem from "./UserScoreItem";
import { chakra } from "@chakra-ui/react";

function UserScoreList({ users }) {
  return (
    <Flex flexDir="column">
      {users.map((user) => (
        <UserScoreItem key={user.username} user={user} />
      ))}
    </Flex>
  );
}

export default UserScoreList;
