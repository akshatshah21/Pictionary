import { useContext, useState, useRef } from "react"
import { Flex } from "@chakra-ui/react";
import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { SocketContext } from "../App";
import { BsEraserFill } from 'react-icons/bs';
import {GoPrimitiveDot} from 'react-icons/go';
import {ImBin} from 'react-icons/im';

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
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);
    const [sColor, setSColor] = useState("red");
    function changeColor(color) {
        canvasRef.current.eraseMode(false);
        setSColor(color);
    }

    const onCanvasChange = () => {
        console.log("hello", canvasRef.current.exportImage('png'))
        // socket.emit('drawing', {
        //     // ref: ref
        // });
    
        // socket.on("drawing", (data) => {
        //   navigate(`/room/${data.gameID}/settings`);
        // });
    };
    

    
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
                onStroke={()=>onCanvasChange()}
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
                    <ImBin/>
                </Button>
                <Button
                    size="sm"
                    border="2px"
                    _hover={{}}
                    _active={{}}
                    borderColor="black"
                    onClick={() => canvasRef.current.eraseMode(true)}
                >
                    <BsEraserFill/>
                </Button>
                <Button
                    size="sm"
                    border="2px"
                    _hover={{}}
                    _active={{}}
                    borderColor="black"
                    onClick={() => setStrokeWidth(4)}
                >
                    <GoPrimitiveDot/>
                </Button>
                <Button
                    size="sm"
                    border="2px"
                    _hover={{}}
                    _active={{}}
                    borderColor="black"
                    onClick={() => setStrokeWidth(6)}
                >
                    <GoPrimitiveDot size = '2em'/>
                </Button>
                <Button
                    size="sm"
                    border="2px"
                    _hover={{}}
                    _active={{}}
                    borderColor="black"
                    onClick={() => setStrokeWidth(8)}
                >
                   <GoPrimitiveDot size = '3em'/>
                </Button>
            </Stack>
        </Flex>
    );
}

export default DrawingBoard;


