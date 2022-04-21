import {
  Flex,
  Grid,
  GridItem,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../App";

import Message from "./Message";

function ChatWindow({ inputDisabled }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);

  const inputBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const messagesList = document.querySelector("#message-list");
    messagesList.scroll({ top: messagesList.scrollHeight, behavior: "smooth" });
    const messageInput = document.querySelector("#message-input");
    messageInput.focus();
  }, []);

  useEffect(() => {
    const onMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("message", onMessage);

    return () => socket.off("message", onMessage);
  }, [socket, setMessages]);

  useEffect(() => {
    const onCorrectGuess = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("correctGuess", onCorrectGuess);

    return () => socket.off("correctGuess", onCorrectGuess);
  }, [socket, setMessages]);

  useEffect(() => {
    const onCloseGuess = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("closeGuess", onCloseGuess);

    return () => socket.off("closeGuess", onCloseGuess);
  }, [socket, setMessages]);

  return (
    <Grid
      id="message-list"
      templateColumns="minmax(0, 1fr)"
      justify="stretch"
      h="100%"
      p="md:1"
    >
      <Flex flexDir="column" overflow="auto">
        {messages.map((message) => (
          <Message
            key={message.timestamp}
            content={message.content}
            user={message.name}
            type={message.type}
          />
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
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim() !== "") {
                socket.emit("message", { message: input });
                setInput("");
              }
            }
          }}
          disabled={inputDisabled}
        />
      </GridItem>
    </Grid>
  );
}

export default ChatWindow;
