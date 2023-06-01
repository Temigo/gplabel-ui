"use client"

import {
    Box,
    Flex,
    Center,
    Spacer,
    Text,
    Stack,
    Button,
    Image,
    List,
    ListItem,
    ListIcon,
    Heading,
    IconButton,
    Badge,
    Radio, RadioGroup,
    LinkBox, LinkOverlay,
    Card, CardHeader, CardBody, CardFooter,
    Container,
    Progress
} from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'
import { CiCrop, CiZoomIn, CiZoomOut } from 'react-icons/ci'
import { GoChevronLeft, GoCheck } from 'react-icons/go'

import { Annotorious } from '@recogito/annotorious';
import { ShapeLabelsFormatter } from '@recogito/annotorious-shape-labels'
import '@recogito/annotorious/dist/annotorious.min.css';

import { useRef, useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import uniqolor from 'uniqolor'

var MyFormatter = (annotation) => {
    console.log('formatting', annotation)
    if (annotation.bodies.length == 0) {
        return {}
    }
    return {
        'style': 'stroke-width: 2; stroke: ' + uniqolor(annotation.id).color
    }
}

export default function LabelPage() {
    const canvasRef = useRef();

    const [ currentPosX, setCurrentPosX ] = useState(null)
    const [ currentPosY, setCurrentPosY ] = useState(null)
    //const [ objects, setObjects ] = useState([]);

    const drawRectangle = () => {
      const context = canvasRef.current.getContext("2d");
      context.strokeStyle = "white";
      context.lineWidth = 2;
      context.strokeRect(50, 30, 110, 90);
      context.strokeRect(170, 65, 100, 80);
    };
    // Ref to the image DOM element
    const imgEl = useRef();

    // The current Annotorious instance
    const [ anno, setAnno ] = useState();

    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');

    const { isOpen, onToggle, onClose } = useDisclosure()

    const [ showLabelEditor, toggleLabelEditor ] = useState(false);
    const labels = [ "plane", "drone", "balloon" ]
    // Init Annotorious when the component
    // mounts, and keep the current 'anno'
    // instance in the application state
    useEffect(() => {
      let annotorious = null;

      if (imgEl.current) {
        // Init
        annotorious = new Annotorious({
          image: imgEl.current,
          //crosshair: true,
          disableEditor: true,
          fragmentUnit: "percent",
          handleRadius: 4,
          widgets: [
              //LabelWidget,
              {widget: 'TAG', vocabulary: ['plane', 'drone']}
          ],
          // formatter: [
          //     'ShapeLabelsFormatter'
          // ]
        });
        annotorious.formatters = [...annotorious.formatters, MyFormatter ]

        // Attach event handlers here
        annotorious.on('createSelection', selection => {
            console.log('new selection', selection)
            const { snippet, transform } = annotorious.getSelectedImageSnippet();
            toggleLabelEditor(true);
        });
        annotorious.on('selectAnnotation', (annotation, element) => {
            console.log('select annotation')
            toggleLabelEditor(true);
            setSelectedLabel(annotation.body[0].value)
        });
        annotorious.on('updateAnnotation', (annotation, previous) => {
            console.log('update annotation')
            toggleLabelEditor(false)
            setSelectedLabel(-1)
        })
        annotorious.on('cancelSelected', selection => {
            toggleLabelEditor(false)
        });
        annotorious.on('createAnnotation', annotation => {
          console.log('created', annotation, objects.length);
          // let ar = annotation.target.selector.value.split(":")[1].split(",")
          // setObjects([...objects, {
          //     x: Number(ar[0]),
          //     y: Number(ar[1]),
          //     width: Number(ar[2]),
          //     height: Number(ar[3]),
          //     label: annotation.body[0].value
          // }])
        });

        annotorious.on('updateAnnotation', (annotation, previous) => {
          console.log('updated', annotation, previous);
        });

        annotorious.on('deleteAnnotation', annotation => {
          console.log('deleted', annotation);
        });
      }

      // Keep current Annotorious instance in state
      setAnno(annotorious);

      // Cleanup: destroy current instance
      return () => annotorious.destroy();
    }, []);

    // Toggles current tool + button label
    const toggleTool = () => {
      if (tool === 'rect') {
        setTool('polygon');
        anno.setDrawingTool('polygon');
      } else {
        setTool('rect');
        anno.setDrawingTool('rect');
      }
    }

    let objects = anno == undefined ? [] : anno.getAnnotations().map((annotation) => {
        let ar = annotation.target.selector.value.split(":")[1].split(",")
        return {
            x: Number(ar[0]),
            y: Number(ar[1]),
            width: Number(ar[2]),
            height: Number(ar[3]),
            label: annotation.body[0] == undefined ? "" : annotation.body[0].value,
            annotation: annotation
        }
    })

    let label = async (idx) => {
        console.log('labeling')
        let s = anno.getSelected();
        s.body = [{
            type: 'TextualBody',
            purpose: 'tagging',
            value: idx
        }]
        await anno.updateSelected(s);
        anno.saveSelected();
        toggleLabelEditor();
    }

    console.log("objects", objects)
    console.log(anno == undefined ? "" : anno.getSelected())
    const [ selectedLabel, setSelectedLabel ] = useState(-1)
    // if (anno !== undefined && anno.getSelected() !== undefined && anno.getSelected().body[0] !== undefined) {
    //     selectedLabel = anno.getSelected().body[0].value
    // }
    console.log("selectedLabel", selectedLabel)
    // <canvas
    //     ref={canvasRef}
    //     style={{
    //         height: "100%",
    //         width: "100%",
    //         background: "url('2023-03-01T10_05_54_18399.png')"
    //     }}
    //     alt='Frame'
    //     onMouseDown={(e) => {
    //         var rect = e.target.getBoundingClientRect();
    //         var x = e.clientX - rect.left;
    //         var y = e.clientY - rect.top;
    //         console.log(x, y, rect.width, rect.height);
    //         setCurrentPosX(x/rect.width);
    //         setCurrentPosY(y/rect.height);
    //     }}
    //     onMouseUp={(e) => {
    //         var rect = e.target.getBoundingClientRect();
    //         var x = e.clientX - rect.left;
    //         var y = e.clientY - rect.top;
    //         setObjects([...objects, {
    //             x: currentPosX,
    //             y: currentPosY,
    //             width: x/rect.width - currentPosX,
    //             height: y/rect.height - currentPosY,
    //             label:'other'
    //         }])
    //         console.log('added')
    //     }}
    // />

    return (
        <Flex flexDirection='column' h='80vh' width='100%'>
            <Stack direction='row' align='stretch' h='70vh'>
                <Flex w='70%' h='70vh' alignItems='center' justifyContent='center'>
                <Stack direction='column' w='100%'  justifyContent='center' alignItems='center'>
                    <Flex h='50px' flexDirection='row' justifyContent='center'>
                        <IconButton
                            variant='outline'
                            colorScheme='teal'
                            fontSize='20px'
                            icon={<CiZoomIn/>}
                        />
                        <IconButton
                            variant='outline'
                            colorScheme='teal'
                            fontSize='20px'
                            icon={<CiZoomOut/>}
                        />
                    </Flex>

                    <Center>
                    <Image
                        ref={imgEl}
                        src="2023-03-01T10_05_54_18399.png"
                        alt='Frame'
                    />
                    </Center>
                    <Flex flexDirection='row' width='70%'>
                        <IconButton
                            variant='outline'
                            fontSize='20px'
                            icon={<GoChevronLeft/>}
                        />
                        <Spacer/>
                        <IconButton
                            variant='outline'
                            fontSize='20px'
                            icon={<GoCheck/>}
                        />
                    </Flex>
                </Stack>
                </Flex>
                { !showLabelEditor ?
                <Flex w='30%' h='70vh' flexDirection='column' spacing={10}>
                    <Container>
                    <Heading size='md'>
                        Objects labelled
                    </Heading>
                    <Stack spacing={3}>
                        {objects.map((item, idx) => {
                            console.log('hsl(' + (idx * (360 / 10) %360) +'100%,50%)');
                            return (
                            <LinkBox as="article" key={idx} onClick={() => {
                                anno.selectAnnotation(item.annotation)
                                toggleLabelEditor(true)
                                setSelectedLabel(item.annotation.body[0].value)
                            }}>
                            <Card bg={uniqolor(item.annotation.id).color}>
                                <CardBody>
                                <LinkOverlay href="#">
                                <Badge size='lg'>{item.label == "" ? "" : labels[item.label]} </Badge>
                                </LinkOverlay>
                                </CardBody>
                            </Card>
                            </LinkBox>
                            );
                        })}
                    </Stack>
                    </Container>
                </Flex>
                :
                <Flex w='30%' h='70vh' flexDirection='column' spacing={10}>
                    <Heading size='md'>
                        Pick a label
                    </Heading>
                    <RadioGroup onChange={async (idx) => label(idx)}>
                        <Stack>
                        {labels.map((item, idx) =>
                            <Radio
                                size='lg'
                                colorScheme='tomato'
                                value={idx}
                                key={idx} >
                                {item}
                            </Radio>
                        )}
                        </Stack>
                    </RadioGroup>
                </Flex> }
            </Stack>
            <Spacer/>
            <Progress value={60} width='100%' height='3vh' hasStripe/>
            </Flex>
    );
}
