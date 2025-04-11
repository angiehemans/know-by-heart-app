import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Container,
  Textarea,
  Button,
  Title,
  Loader,
  Stack,
  FileInput,
  Image,
  Avatar,
  FileButton,
  Flex,
  Text,
} from "@mantine/core"
import api, { setAuthHeaders, clearAuthHeaders } from "../../utils/api"
import Link from "next/link"
import LoggedInWrapper from "../../components/LoggedInWrapper"

interface User {
  id: number
  email: string
  username: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [aboutMe, setAboutMe] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initialize = async () => {
      const token = router.query.token as string
      const storedToken = localStorage.getItem("token")

      if (token) {
        setAuthHeaders(token)
      } else if (storedToken) {
        setAuthHeaders(storedToken)
      } else {
        console.warn("No token found")
        router.push("/login")
        return
      }

      try {
        const res = await api.get("/users/me")
        setAboutMe(res.data.about_me || "")
        setPreviewUrl(res.data.profile_picture_url || "")
        setUser(res.data)
      } catch (err) {
        console.warn("Auth failed", err)
        clearAuthHeaders()
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    if (router.isReady) {
      initialize()
    }
  }, [router.isReady])

  const handleSave = async () => {
    const formData = new FormData()
    formData.append("user[about_me]", aboutMe)

    if (profilePicture) {
      formData.append("user[profile_picture]", profilePicture)
    }

    try {
      await api.patch("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // ✅ Redirect after successful save
      router.push("/user/home")
    } catch (err) {
      console.error("Save failed", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    clearAuthHeaders()
    router.push("/login")
  }

  if (loading) return <Loader />

  return (
    <LoggedInWrapper user={user}>
      <Container size="sm" mt="xl">
        <Title order={2} mb="md">
          Edit Profile
        </Title>
        <Stack>
          <FileButton
            accept="image/png,image/jpeg"
            onChange={(file) => {
              setProfilePicture(file)
              setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl)
            }}
          >
            {(props) => (
              <Button {...props} size="160px" variant="subtle" color="gray">
                <Flex direction="column" align="center">
                  <Avatar src={previewUrl} radius="50%" size="100px" />
                  <Text size="sm" mt="xs" c="dimmed">
                    Change Profile Picture
                  </Text>
                </Flex>
              </Button>
            )}
          </FileButton>
          <Textarea
            label="About Me"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.currentTarget.value)}
            minRows={4}
          />

          <Button onClick={handleSave}>Save</Button>
        </Stack>
        <Button
          onClick={handleLogout}
          color="red"
          variant="light"
          w="100%"
          mt={20}
        >
          Log out
        </Button>
      </Container>
    </LoggedInWrapper>
  )
}
