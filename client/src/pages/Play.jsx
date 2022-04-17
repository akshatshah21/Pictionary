import { Button, Flex, Input, Text } from "@chakra-ui/react";
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
import { useState } from "react";

function Play() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur ",
    defaultValues: { username: "wacky-pro" },
  });

  const {
    isOpen: isJoinModalOpen,
    onOpen: onJoinModalOpen,
    onClose: onJoinModalClose,
  } = useDisclosure();

  const [roomCode, setRoomCode] = useState("");

  const joinRoom = () => {
    const username = getValues("username");
    // TODO: use roomCode and username to join room
  };

  // TODO: Implement create room with username
  const createRoom = (data) => console.log(data);

  return (
    <Flex h="85vh" marginTop="10vh">
      <Flex
        marginX="auto"
        marginTop="40"
        marginBottom="auto"
        border="1px"
        borderRadius="md"
        borderColor="gray.400"
        w="40vw"
        flexDir="column"
        padding="8"
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            placeholder="Username"
            size="lg"
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" ? (
            <Text fontSize="sm" color="tomato">
              Go on, pick a username. Don&apos;t be shy!
            </Text>
          ) : (
            <FormHelperText>Use your imagination!</FormHelperText>
          )}
        </FormControl>
        {/* TODO Avatar Input */}
        <Flex>Avatar Input</Flex>
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
          <ModalHeader>Modal Title</ModalHeader>
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
                    console.log(value);
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
            <Button colorScheme="green">Join</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Play;
