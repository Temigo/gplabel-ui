"use client"

import {
    Box,
    Flex,
    Center,
    Spacer,
    Text,
    Stack,
    Button,
    SimpleGrid,
    StatGroup, Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
    Progress
} from '@chakra-ui/react'
import Link from 'next/link';
import { GoBeaker, GoCloudDownload } from 'react-icons/go'

// <Stack direction='column'>
//     <Flex width='100wh' height='100vh' alignItems='center' justifyContent='center'>

//     </Flex>
// </Stack>
export default function Dashboard() {
    return (
        <Center height='80vh'>
        <SimpleGrid columns={2} spacing={10} width='70%'>
            <Box>
                <StatGroup>
                    <Stat size='4xl'>
                        <StatLabel fontSize='2xl'>Labelled by you</StatLabel>
                        <StatNumber fontSize='2xl'>5</StatNumber>
                        <StatHelpText>images</StatHelpText>
                    </Stat>
                    <Stat size='4xl'>
                        <StatLabel fontSize='2xl'>Remain to label</StatLabel>
                        <StatNumber fontSize='2xl'>3</StatNumber>
                        <StatHelpText>images</StatHelpText>
                    </Stat>
                </StatGroup>
            </Box>
            <Stack spacing={10}>
                <Center>
                <Link href="/label">
                <Button
                  size='lg'
                  bg={'tomato'}
                  color={'white'}
                  _hover={{
                    bg: 'orange',
                  }}
                  leftIcon={<GoBeaker/>}>
                  Label
                </Button>
                </Link>
                </Center>
                <Center>
                <Link href="/">
                <Button
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  leftIcon={<GoCloudDownload/>}>
                  Request more images
                </Button>
                </Link>
                </Center>
            </Stack>
            <Box>
                <Progress value={60}/>
            </Box>
        </SimpleGrid>
        </Center>
    );
}
