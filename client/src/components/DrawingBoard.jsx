import {useState, useRef} from "react"
import { Flex } from "@chakra-ui/react";
import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { ReactSketchCanvas } from 'react-sketch-canvas';

function DrawingBoard() {
  const colorClasses = [
    "white",
    "grey",
    "red",
    "orange",
    "yellow",
    "green",
    "skyblue",
    "blue",
    "purple",
    "pink",
    "brown",
    "black",
  ];

  const canvasRef = useRef(null);
  const [sColor, setSColor] = useState("red");
  function changeColor(color) {
    canvasRef.current.eraseMode(false);
    setSColor(color);
  }
  const [strokeWidth, setStrokeWidth] = useState(4);
  return (
    <Flex
      width="100%"
      height="100%"
      flexDir="column"
      justify="stretch"
      align="stretch"
    >
      <ReactSketchCanvas
        ref={canvasRef}
        width="100%"
        height="100%"
        strokeWidth={strokeWidth}
        strokeColor={sColor}
      />
      <Stack spacing={2} direction="row" align="center" m="10px">
        {colorClasses.map((color) => (
          <Button
            key={color}
            bgColor={color}
            size="sm"
            border="2px"
            _hover={{}}
            _active={{}}
            borderColor="black"
            onClick={() => changeColor(color)}
          ></Button>
        ))}
        <Button
          size="sm"
          border="2px"
          _hover={{}}
          _active={{}}
          borderColor="black"
          onClick={() => canvasRef.current.clearCanvas()}
        >
          clear
        </Button>
        <Button
          size="sm"
          border="2px"
          _hover={{}}
          _active={{}}
          borderColor="black"
          onClick={() => canvasRef.current.eraseMode(true)}
        >
          erase
        </Button>
        <Button
          size="sm"
          border="2px"
          _hover={{}}
          _active={{}}
          borderColor="black"
          onClick={() => setStrokeWidth(4)}
        >
          small
        </Button>
        <Button
          size="sm"
          border="2px"
          _hover={{}}
          _active={{}}
          borderColor="black"
          onClick={() => setStrokeWidth(6)}
        >
          medium
        </Button>
        <Button
          size="sm"
          border="2px"
          _hover={{}}
          _active={{}}
          borderColor="black"
          onClick={() => setStrokeWidth(8)}
        >
          large
        </Button>
      </Stack>
    </Flex>
  );
}
  
export default DrawingBoard;


