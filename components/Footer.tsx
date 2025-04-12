import { Box, Container, Group, Text, Anchor } from "@mantine/core"
import Link from "next/link"

export default function Footer() {
  return (
    <Box component="footer" py="md" mt="xl">
      <Container size="sm">
        <Text size="sm" c="dimmed" ta="center">
          © {new Date().getFullYear()} GoodSongs ❤︎ | Built in California 🏳️‍⚧️
        </Text>
      </Container>
    </Box>
  )
}
