"use client"

import {
    Flex,
    Center,
    Text,
    Button,
    Spacer,
    Box,
    Container,
    ButtonGroup
}  from '@chakra-ui/react'
import { signOut } from "next-auth/react"
import Link from 'next/link';
import { GoHome, GoSignOut } from 'react-icons/go'

export default function NavBar() {
    return (
        <Center>
        <Flex flexDirection='row' width='90%' height='20vh' alignItems='center' spacing={10}>
            <Center>
            <Text fontSize='6xl' color='tomato'><b>GP Label</b></Text>
            </Center>
            <Spacer/>
            <ButtonGroup spacing={10}>

                <Button leftIcon={<GoHome/>}>
                <Link href="/">
                    Dashboard
                </Link>
                </Button>

                <Button onClick={signOut} leftIcon={<GoSignOut/>}>
                    Log out
                </Button>
            </ButtonGroup>
        </Flex>
        </Center>
    )
}
