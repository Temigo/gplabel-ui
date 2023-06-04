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
import { GoChevronLeft, GoCheck, GoX, GoTrashcan } from 'react-icons/go'

//import { Annotorious } from '@recogito/annotorious';
//import { ShapeLabelsFormatter } from '@recogito/annotorious-shape-labels'
import '@recogito/annotorious/dist/annotorious.min.css';

import { useRef, useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import uniqolor from 'uniqolor'

import { downloadImage, getImage } from "../api.js"

var MyFormatter = (annotation: any) => {
    console.log('formatting', annotation)
    if (annotation.bodies.length == 0) {
        return {}
    }
    return {
        'style': 'stroke-width: 2; stroke: ' + uniqolor(annotation.id).color
    }
}

export default function LabelPage(props) {
    // Contains src to image
    const [imageSrc, setImageSrc] = useState("");
    // Contains dict of image attributes
    const [ currentImage, setCurrentImage] = useState();
    console.log("current image", currentImage)

    // Ref to the image DOM element
    const imgEl = useRef();

    // Download image
    useEffect(() => {
        getImage(props.imageId)
            .then((data) => {
                setCurrentImage(data);
                return downloadImage(data.filename);
            }).then((data) => {
                var url = URL.createObjectURL(data);
                setImageSrc(url);
            })
    }, []);

    // The current Annotorious instance
    const [ anno, setAnno ] = useState();

    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');
    const [ showLabelEditor, toggleLabelEditor ] = useState(false);
    const labels = [ "other", "aircraft", "drone", "balloon", "bird", "kite", "helicopter"]
    // Init Annotorious when the component
    // mounts, and keep the current 'anno'
    // instance in the application state
    useEffect(() => {
        async function load() {
            const x = await import('@recogito/annotorious');
            return x.Annotorious;
        }
        load().then(Annotorious => {
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
        console.log('created', annotorious)
        annotorious.formatters = [...annotorious.formatters, MyFormatter ]

        // Attach event handlers here
        annotorious.on('createSelection', selection => {
            console.log('new selection', selection)
            const { snippet, transform } = annotorious.getSelectedImageSnippet();
            toggleLabelEditor(true);
        });
        annotorious.on('selectAnnotation', (annotation, element) => {
            console.log('select annotation')
            //toggleLabelEditor(true);
            setSelectedLabel(annotation.body[0].value)
        });
        annotorious.on('updateAnnotation', (annotation, previous) => {
            console.log('update annotation')
            toggleLabelEditor(false)
            setSelectedLabel(-1)
        })
        annotorious.on('cancelSelected', selection => {
            toggleLabelEditor(false)
            setSelectedLabel(-1)
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
          toggleLabelEditor(false)
        });
      }
      // Keep current Annotorious instance in state
      setAnno(annotorious);

      // Cleanup: destroy current instance
      //return () => annotorious.destroy();
    })
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
    // <Flex h='50px' flexDirection='row' justifyContent='center'>
    //     <IconButton
    //         variant='outline'
    //         colorScheme='teal'
    //         fontSize='20px'
    //         icon={<CiZoomIn/>}
    //     />
    //     <IconButton
    //         variant='outline'
    //         colorScheme='teal'
    //         fontSize='20px'
    //         icon={<CiZoomOut/>}
    //     />
    // </Flex>

    return (
        <Flex flexDirection='column' h='80vh' width='100%'>
            <Stack direction='row' align='stretch' h='70vh'>
                <Flex w='70%' h='70vh' alignItems='center' justifyContent='center'>
                <Stack direction='column' w='100%'  justifyContent='center' alignItems='center'>

                    <Center>
                    <Image
                        ref={imgEl}
                        src={imageSrc}
                        alt='Frame'
                    />
                    </Center>
                    <Flex flexDirection='row' width='70%'>
                        <Button
                            variant='outline'
                            fontSize='20px'
                            leftIcon={<GoChevronLeft/>}
                        >
                            Previous
                        </Button>
                        <Spacer/>
                        <Button
                            variant='outline'
                            fontSize='20px'
                            colorScheme='orange'
                            rightIcon={<GoX/>}
                        >
                            Skip
                        </Button>
                        <Spacer/>
                        <Button
                            variant='outline'
                            fontSize='20px'
                            colorScheme='green'
                            rightIcon={<GoCheck/>}
                        >
                            Save
                        </Button>
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

                            <Card
                                borderColor='tomato'
                                key={idx}
                                borderWidth={(selectedLabel !== -1 && anno !== undefined && anno.getSelected() !== undefined &&  anno.getSelected().id == item.annotation.id) ? 5 : 0}
                                bg={uniqolor(item.annotation.id).color} direction="row" alignItems='center'>
                                <LinkBox as="article"  onClick={() => {
                                    if (Number(selectedLabel) == -1) {
                                        anno.selectAnnotation(item.annotation)
                                        toggleLabelEditor(true)
                                        setSelectedLabel(item.annotation.body[0].value)
                                    }
                                }}>
                                <CardBody>
                                    <LinkOverlay href="#">
                                    <Badge size='lg'>{item.label == "" ? "" : labels[item.label]} </Badge>
                                    </LinkOverlay>
                                </CardBody>
                                </LinkBox>
                                <Spacer/>
                                <Box>
                                <IconButton
                                    variant="ghost"
                                    colorScheme='black'
                                    size='lg'
                                    icon={<GoTrashcan/>}
                                    onClick={() => {
                                        anno.removeAnnotation(item.annotation)
                                        toggleLabelEditor(false)
                                        setSelectedLabel(-1)
                                    }}
                                />
                                </Box>
                            </Card>

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
                    <RadioGroup onChange={async (idx) => label(idx)} defaultValue={(Number(selectedLabel) == -1) ? "0" : Number(selectedLabel).toString()}>
                        <Stack>
                        {labels.map((item, idx) =>
                            <Radio
                                size='lg'
                                colorScheme='tomato'
                                value={idx.toString()}
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
