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

import '@recogito/annotorious/dist/annotorious.min.css';

import { useRef, useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import uniqolor from 'uniqolor'

import {
    downloadImage,
    getImage,
    labels,
    saveAnnotations,
    getAnnotationsByImage
} from "../api.js"

// Coloring annotation boxes with id-dependent color
var MyFormatter = (annotation: any) => {
    if (annotation.bodies.length == 0) {
        return {}
    }
    return {
        'style': 'stroke-width: 2; stroke: ' + uniqolor(annotation.id).color
    }
}

var updateAnnotations = (anno, data) => {
    anno.clearAnnotations();
    data.forEach((a) => {
        anno.addAnnotation({
            "@context": "http://www.w3.org/ns/anno.jsonld",
            body: [{
                type: "TextualBody",
                purpose: "tagging",
                value: labels.indexOf(a.label).toString()
            }],
            id: `${a.id}`,
            type: "Annotation",
            new: false,
            target: {
                selector: {
                    type: "FragmentSelector",
                    conformsTo: "http://www.w3.org/TR/media-frags/",
                    value: `xywh=percent:${a.x},${a.y},${a.width},${a.height}`
                },
            }
        });
    });
}

var getAnnotationList = (anno) => {
    if (anno !== undefined) { console.log("setting objects with ", anno.getAnnotations()) }
    return (anno == undefined) ? [] : anno.getAnnotations().map((annotation) => {
        let ar = annotation.target.selector.value.split(":")[1].split(",")
        return {
            x: Number(ar[0]),
            y: Number(ar[1]),
            width: Number(ar[2]),
            height: Number(ar[3]),
            label: annotation.body[0] == undefined ? "" : annotation.body[0].value,
            annotation: annotation
        }
    }).sort((a, b) => a.id < b.id) // Keep order of annotations constant
}

export default function LabelPage(props) {
    // Contains src to image
    const [imageSrc, setImageSrc] = useState("");
    const [imageBlob, setImageBlob] = useState();

    // Contains dict of image attributes
    const [ currentImage, setCurrentImage] = useState();
    console.log("current image", currentImage, props.userId, props.imageId)

    // Ref to the image DOM element
    const imgEl = useRef();
    // The current Annotorious instance
    const [ anno, setAnno ] = useState();
    const [ showLabelEditor, toggleLabelEditor ] = useState(false);
    const [ selectedLabel, setSelectedLabel ] = useState(-1)

    // Download image
    useEffect(() => {
        getImage(props.imageId)
            .then((data) => {
                setCurrentImage(data);
                return downloadImage(data.filename);
            }).then((data) => {
                var url = URL.createObjectURL(data);
                setImageSrc(url);
                setImageBlob(data);
            });
    }, []);

    const [ objects, setObjects ] = useState([])

    useEffect(() => {
        if ((anno !== undefined) && (imageBlob !== undefined) && imgEl.current) {
            getAnnotationsByImage(props.imageId)
                .then((data) => {
                    updateAnnotations(anno, data)
                    setObjects(getAnnotationList(anno))
                    //console.log("got annotations", objects)
                })
        }
    }, [imageSrc, anno])

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
                });
                annotorious.formatters = [...annotorious.formatters, MyFormatter ]

                // Attach event handlers here
                annotorious.on('createSelection', selection => {
                    console.log('new selection', selection)
                    toggleLabelEditor(true);
                    setObjects(getAnnotationList(anno))
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
                    setObjects(getAnnotationList(anno))
                })
                annotorious.on('cancelSelected', selection => {
                    toggleLabelEditor(false)
                    setSelectedLabel(-1)
                });
                annotorious.on('createAnnotation', annotation => {
                  console.log('created', annotation, objects.length);
                  //setObjects(getAnnotationList(anno))
                });

                annotorious.on('deleteAnnotation', annotation => {
                  console.log('deleted', annotation);
                  toggleLabelEditor(false)
                  setObjects(getAnnotationList(anno))
                });

            }
            // Keep current Annotorious instance in state
            setAnno(annotorious);

            // Cleanup: destroy current instance
            //return () => annotorious.destroy();
        })
    }, []);

    // Function to add label to existing annotation
    let label = async (idx) => {
        //console.log('labeling')
        let s = anno.getSelected();
        s.body = [{
            type: 'TextualBody',
            purpose: 'tagging',
            value: idx
        }]
        anno.updateSelected(s, true)
        // This function updateSelected will not save immediately
        // hence the async. We need it to be saved for the annotation
        // to have an uid assigned to it. We should not update objects
        // until the uid is assigned. Hence the timeout of 200ms.
        toggleLabelEditor(false);
        setTimeout(() => setObjects(getAnnotationList(anno)), 200)
    }

    console.log("objects", objects)

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
                            onClick={async () => {
                                var list = await saveAnnotations(objects, props.imageId, props.userId)
                                updateAnnotations(anno, list)
                            }}
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
                                        setObjects(getAnnotationList(anno))
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
