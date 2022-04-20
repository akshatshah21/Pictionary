import {
  Flex,
  Grid,
  GridItem,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";

import Message from "./Message";

const dummyMessages = [
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "Guessed it correctly!",
    timestamp: new Date(),
    type: "correct",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "drum kit",
    timestamp: new Date(),
    type: "guess",
  },
  {
    username: "Hades",
    content: "Guessed it correctly!",
    timestamp: new Date(),
    type: "correct",
  },
  {
    username: "Hades",
    content: "My turn!",
    timestamp: new Date(),
    type: "turn",
  },
  {
    username: "Hades",
    content: "My turn!",
    timestamp: new Date(),
    type: "turn",
  },
];

function ChatWindow() {
  const { input, setInput } = useState("");

  const inputBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const messagesList = document.querySelector("#message-list");
    messagesList.scroll({ top: messagesList.scrollHeight, behavior: "smooth" });
    const messageInput = document.querySelector("#message-input");
    messageInput.focus();
  }, []);

  return (
    <Grid
      id="message-list"
      templateColumns="minmax(0, 1fr)"
      justify="stretch"
      h="100%"
      p="md:1"
    >
      <Flex flexDir="column" overflow="auto">
        {dummyMessages.map((message) => (
          <Message key={message.timestamp} message={message} />
        ))}
      </Flex>
      <GridItem my="0.5" p="1" rounded="sm">
        <Input
          id="message-input"
          bgColor={inputBgColor}
          placeholder="Take a guess!"
          value={input}
          p="1 md:6"
          fontSize="md:lg"
          onChange={(e) => setInput(e.target.value.trim())}
        />
      </GridItem>
    </Grid>
  );
}

export default ChatWindow;
