import { useRouter } from "next/router"
import { Container, Card, Text, Button, Divider, Stack } from "@mantine/core"

export default function SignUpPage() {
  const router = useRouter()

  const handleSpotifySignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/spotify?show_dialog=true`
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <Text size="lg" fw={700}>
            Create an Account
          </Text>

          <Divider my="sm" label="via" labelPosition="center" />

          <Button
            fullWidth
            color="green"
            variant="outline"
            onClick={handleSpotifySignup}
          >
            Sign up with Spotify
          </Button>
        </Stack>
      </Card>
    </Container>
  )
}
