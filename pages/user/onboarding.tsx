import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Container,
  Text,
  TextInput,
  Button,
  Stack,
  Notification,
} from "@mantine/core"
import api from "../../utils/api"

export default function UserOnboarding() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    try {
      const lowercaseUsername = username.toLowerCase().trim()
      const res = await api.post("/user/onboarding", {
        user: { username: lowercaseUsername },
      })
      setSuccess("Username set successfully!")
      setTimeout(() => router.push("/user/home"), 1000)
    } catch (err: any) {
      setError(err?.response?.data?.errors?.[0] || "Something went wrong")
    }
  }

  return (
    <Container mt="xl" size="xs">
      <Stack>
        <Text size="xl" fw={700}>
          Create Your Username
        </Text>

        {error && (
          <Notification color="red" onClose={() => setError("")}>
            {error}
          </Notification>
        )}

        {success && (
          <Notification color="green" onClose={() => setSuccess("")}>
            {success}
          </Notification>
        )}

        <TextInput
          label="Username"
          placeholder="e.g. musicfan_99"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />

        <Button onClick={handleSubmit} disabled={!username}>
          Continue
        </Button>
      </Stack>
    </Container>
  )
}
