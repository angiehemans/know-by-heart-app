import Head from "next/head"
import Link from "next/link"
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Box,
  Anchor,
  Flex,
} from "@mantine/core"
import { ColorSchemeToggle } from "../components/ColorSchemeToggle"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <>
      <Head>
        <title>GoodSongs ❤︎ | Music Reviews & Discovery</title>
        <meta
          name="description"
          content="Discover and review music with GoodSongs ❤︎ — your place to share thoughts on your favorite tracks and discover new sounds."
        />
      </Head>

      <Container size="md" pb="xl">
        <Flex justify="space-between" align="center" py="lg">
          <Text fw={700}>GoodSongs ❤︎</Text>
          <ColorSchemeToggle />
        </Flex>
        <Stack gap="xl" align="center">
          <Title order={1} ta="center">
            GoodSongs ❤︎
          </Title>
          <Text size="lg" ta="center" maw={600}>
            GoodSongs ❤︎ is a music discovery platform where you can review
            tracks you've listened to, bookmark songs for later, and explore
            what other fans are loving. Built for music lovers, by music lovers.
          </Text>

          <Group>
            <Button component={Link} href="/login" size="md">
              Log In
            </Button>
            <Button
              component={Link}
              href="/sign_up"
              variant="outline"
              size="md"
            >
              Sign Up
            </Button>
          </Group>

          <Box pt="lg">
            <Text size="sm" c="dimmed" ta="center">
              Log in with Spotify to get started — your recent plays, reviews,
              and favorites all in one place.
            </Text>
          </Box>
        </Stack>
        <Footer />
      </Container>
    </>
  )
}
