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
import useSound from "use-sound";

import { SocketContext } from "../../App";
import Message from "./Message";
import correctAudio from "../../../assets/audio/correct.mp3";

function ChatWindow({ inputDisabled }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);

  const [playCorrectAudio] = useSound(correctAudio);

  const inputBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const messagesList = document.querySelector("#message-list");
    messagesList.scroll({ top: messagesList.scrollHeight, behavior: "smooth" });
    const messageInput = document.querySelector("#message-input");
    messageInput.focus();
  }, [messages]);

  useEffect(() => {
    const onMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("message", onMessage);

    return () => socket.off("message", onMessage);
  }, [socket, setMessages]);

  useEffect(() => {
    const onCorrectGuess = (message) => {
      if (message.id === socket.id) {
        playCorrectAudio();
      }
      setMessages((prev) => [...prev, message]);
    };
    socket.on("correctGuess", onCorrectGuess);

    return () => socket.off("correctGuess", onCorrectGuess);
  }, [socket, setMessages, playCorrectAudio]);

  useEffect(() => {
    const onCloseGuess = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("closeGuess", onCloseGuess);

    return () => socket.off("closeGuess", onCloseGuess);
  }, [socket, setMessages]);

  return (
    <Grid templateColumns="minmax(0, 1fr)" justify="stretch" h="100%" p="md:1">
      <Flex flexDir="column" overflow="auto" id="message-list">
        {messages.map((message) => (
          <Message
            key={message.timestamp + message.id + message.content}
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
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim() !== "") {
                socket.emit("message", { message: input.trim() });
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
