import {
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import RandomAvatarGenerator from "../components/RandomAvatarGenerator";
import { FaHandPointRight } from "react-icons/fa";

import { CurrentPlayerContext, PlayersContext, SocketContext } from "../App";

function Play() {
  const bgColor = useColorModeValue("white", "gray.900");

  const socket = useContext(SocketContext);
  const [currentPlayer, setCurrentPlayer] = useContext(CurrentPlayerContext);
  const [players, setPlayers] = useContext(PlayersContext);

  const toast = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur ",
    defaultValues: { username: "wacky-pro" },
  });

  const [avatar, setAvatar] = useState("");

  const {
    isOpen: isJoinModalOpen,
    onOpen: onJoinModalOpen,
    onClose: onJoinModalClose,
  } = useDisclosure();

  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");

  const joinRoom = () => {
    if (!roomCode.trim()) {
      return;
    }
    const username = getValues("username");
    setCurrentPlayer({
      id: socket.id,
      name: username,
      avatar,
      isAdmin: false,
    });

    function onValidRoom({ gameID }) {
      toast({
        title: "Joining room...",
        description: "Get ready!",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/room/${gameID}/lobby`);
    }

    function onInvalidRoom({ message }) {
      toast({
        title: message,
        description: "Check the room code and try again!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      socket.off("validRoom", onValidRoom);
    }

    socket.emit("joinRoom", {
      id: roomCode,
      player: {
        id: socket.id,
        name: username,
        avatar,
      },
    });

    socket.once("invalidRoom", onInvalidRoom);
    socket.once("validRoom", onValidRoom);
  };

  const createRoom = (data) => {
    const _currentPlayer = {
      id: socket.id,
      name: data.username,
      avatar,
      isAdmin: true,
    };
    setCurrentPlayer(_currentPlayer);

    setPlayers({ [socket.id]: _currentPlayer });

    socket.emit("newPrivateRoom", {
      name: data.username,
      avatar,
    });

    socket.on("newPrivateRoom", (data) => {
      navigate(`/room/${data.gameID}/lobby`);
    });
  };

  return (
    <Flex h="85vh" marginTop="10vh">
      <Flex
        marginX="auto"
        marginTop="10"
        marginBottom="auto"
        rounded="md"
        w={["95vw", "85vw", "50vw"]}
        flexDir="column"
        padding="8"
        bgColor={bgColor}
      >
        <FormControl>
          <HStack>
            <FormLabel
              fontSize="xl"
              htmlFor="username"
              w="fit-content"
              display="flex"
            >
              Username{" "}
              <Icon
                mt="1"
                ml="2"
                as={FaHandPointRight}
                verticalAlign="baseline"
              />
            </FormLabel>
            <Input
              placeholder="Username"
              size="lg"
              {...register("username", { required: true })}
            />
          </HStack>
          {errors.username?.type === "required" ? (
            <Text fontSize="sm" color="tomato" textAlign="end">
              Go on, pick a username. Don&apos;t be shy!
            </Text>
          ) : (
            <FormHelperText textAlign="end">
              Use your imagination!
            </FormHelperText>
          )}
        </FormControl>

        <HStack justify="center">
          <FormLabel fontSize="xl">
            Choose your avatar <Icon mt="1" as={FaHandPointRight} />
          </FormLabel>

          <RandomAvatarGenerator onAvatarChange={(url) => setAvatar(url)} />
        </HStack>
        <Flex justifyContent="space-evenly">
          <Button
            type="submit"
            w="full"
            marginRight="2"
            onClick={handleSubmit(onJoinModalOpen)}
          >
            Join a room
          </Button>
          <Button
            type="submit"
            w="full"
            marginLeft="2"
            onClick={handleSubmit(createRoom)}
          >
            Create a room
          </Button>
        </Flex>
      </Flex>

      <Modal isOpen={isJoinModalOpen} onClose={onJoinModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join a Pictionary Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="roomCode">Room Code</FormLabel>
              <Flex justifyContent="space-evenly">
                <PinInput
                  type="alphanumeric"
                  size="lg"
                  value={roomCode}
                  onChange={(value) => {
                    setRoomCode(value);
                  }}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </Flex>
              <FormHelperText>
                Ask your friend for a 6-digit code to join the room
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="red"
              mr={3}
              onClick={onJoinModalClose}
            >
              Close
            </Button>
            <Button colorScheme="green" onClick={joinRoom}>
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Play;
