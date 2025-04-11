import { useRouter } from "next/router"
import { Container, Card, Text, Button, Divider, Stack } from "@mantine/core"

export default function LoginPage() {
  const router = useRouter()

  const handleSpotifyLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/spotify?show_dialog=true`
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <Text size="lg" ta="center" fw={700}>
            Log in to Know By Heart
          </Text>

          <Divider my="sm" label="via" labelPosition="center" />

          <Button
            fullWidth
            color="green"
            variant="outline"
            onClick={handleSpotifyLogin}
          >
            Continue with Spotify
          </Button>
        </Stack>
      </Card>
    </Container>
  )
}
