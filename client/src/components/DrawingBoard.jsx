import { useContext, useState, useRef, useEffect } from "react";
import { Flex, Button, Stack } from "@chakra-ui/react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { SocketContext } from "../App";
import { BsEraserFill } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { ImBin } from "react-icons/im";

function DrawingBoard({ canvasEnabled }) {
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
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState("black");

  function changeColor(color) {
    canvasRef.current.eraseMode(false);
    setStrokeColor(color);
  }

  useEffect(() => {
    const onDrawing = (data) => {
      canvasRef.current.loadPaths(data["canvasPath"]);
    };
    socket.on("drawing", onDrawing);

    return () => socket.off("drawing", onDrawing);
  }, [socket]);

  useEffect(() => {
    const onClearCanvas = async () => {
      await canvasRef.current.clearCanvas();
    };
    socket.on("clearCanvas", onClearCanvas);

    return () => socket.off("clearCanvas", onClearCanvas);
  });

  async function updateCanvas(data) {
    socket.emit("drawing", {
      canvasPath: data,
    });
  }

  async function clearCanvas() {
    await canvasRef.current.clearCanvas();
    socket.emit("clearCanvas");
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
        strokeColor={strokeColor}
        allowOnlyPointerType={canvasEnabled ? "all" : "pen"}
        onStroke={updateCanvas}
      />
      {canvasEnabled && (
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
            onClick={clearCanvas}
          >
            <ImBin />
          </Button>
          <Button
            size="sm"
            border="2px"
            _hover={{}}
            _active={{}}
            borderColor="black"
            onClick={() => canvasRef.current.eraseMode(true)}
          >
            <BsEraserFill />
          </Button>
          <Button
            size="sm"
            border="2px"
            _hover={{}}
            _active={{}}
            borderColor="black"
            onClick={() => setStrokeWidth(4)}
          >
            <GoPrimitiveDot />
          </Button>
          <Button
            size="sm"
            border="2px"
            _hover={{}}
            _active={{}}
            borderColor="black"
            onClick={() => setStrokeWidth(6)}
          >
            <GoPrimitiveDot size="2em" />
          </Button>
          <Button
            size="sm"
            border="2px"
            _hover={{}}
            _active={{}}
            borderColor="black"
            onClick={() => setStrokeWidth(8)}
          >
            <GoPrimitiveDot size="3em" />
          </Button>
        </Stack>
      )}
    </Flex>
  );
}

export default DrawingBoard;
