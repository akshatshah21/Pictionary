import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";

function ChooseWordModal({ isOpen, onWordSelect, words }) {
  return (
    <Modal isOpen={isOpen} isCentered size="4xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textAlign="center" fontSize="3xl">
            Choose a word!
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text fontSize="lg">
            Select a word from these three and draw hints about it!
          </Text>
        </ModalBody>

        <ModalFooter>
          <Flex justify="space-evenly" w="100%">
            {words.map((word) => (
              <Button
                size="lg"
                fontSize="xl"
                key={word}
                mr={3}
                onClick={() => onWordSelect(word)}
              >
                {word}
              </Button>
            ))}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ChooseWordModal;
