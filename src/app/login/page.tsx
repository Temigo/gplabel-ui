"use client"

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { signIn } from "next-auth/react"

// import { useSession, signIn, signOut } from "next-auth/react"
//
// import { authOptions } from '../api/auth/[...nextauth]/route.ts'
// import { getServerSession } from "next-auth/next"
//import { Login } from './login'

export default function LoginPage() {
    //const session = await getServerSession(authOptions)
    //console.log(session)
    //<button onClick={() => signIn("github")}>Sign in</button>
    //<FormControl id="email">
    //   <FormLabel>Email address</FormLabel>
    //   <Input type="email" />
    // </FormControl>
    // <FormControl id="password">
    //   <FormLabel>Password</FormLabel>
    //   <Input type="password" />
    // </FormControl>
    return (
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                to label images <Link color={'blue.400'}></Link> ✌️
              </Text>
            </Stack>
            <Box
              rounded={'lg'}
              boxShadow={'lg'}
              p={8}>
              <Stack spacing={4}>
                <Stack spacing={10}>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                    Use GitHub to sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
    );
}
