import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  Container,
  Text,
  Title,
  Textarea,
  Button,
  MultiSelect,
  SegmentedControl,
  Loader,
  Stack,
  Paper,
  Image,
  Flex,
} from "@mantine/core"
import api, { clearAuthHeaders, setAuthHeaders } from "../../utils/api"
import LoggedInWrapper from "../../components/LoggedInWrapper"

// --------------------
// Types
// --------------------
interface TrackInfo {
  id: string
  name: string
  album: string
  artist: string
  spotify_url: string
  spotify_artist_id: string
  album_art_url?: string
}

interface ReviewForm {
  thingsLoved: string[]
  rating: string
  reviewText: string
}

interface User {
  id: number
  email: string
  username: string
}

const loveOptions = [
  "Lyrics",
  "Vocals",
  "Production",
  "Composition",
  "Drums",
  "Guitar",
  "Bass",
]

export default function ReviewTrackPage() {
  const router = useRouter()
  const { trackId } = router.query

  const [track, setTrack] = useState<TrackInfo | null>(null)
  const [form, setForm] = useState<ReviewForm>({
    thingsLoved: [],
    rating: "2",
    reviewText: "",
  })

  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingTrack, setLoadingTrack] = useState(true)

  // Fetch auth + user
  useEffect(() => {
    const initialize = async () => {
      const queryToken = router.query.token as string | undefined
      const storedToken = localStorage.getItem("token")

      if (queryToken) {
        setAuthHeaders(queryToken)
      } else if (storedToken) {
        setAuthHeaders(storedToken)
      } else {
        router.push("/login")
        return
      }

      try {
        const res = await api.get("/users/me")
        const userData: User = res.data

        if (!userData.username) {
          router.push("/user/onboarding")
          return
        }

        setUser(userData)
      } catch (err) {
        clearAuthHeaders()
        router.push("/login")
      } finally {
        setLoadingUser(false)
      }
    }

    if (router.isReady) {
      initialize()
    }
  }, [router.isReady])

  // Fetch track info
  useEffect(() => {
    if (!trackId) return

    const fetchTrack = async () => {
      try {
        const res = await api.get(`/spotify/track_info/${trackId}`)
        setTrack(res.data)
      } catch (err) {
        console.error("Error loading track info:", err)
        router.push("/user/home")
      } finally {
        setLoadingTrack(false)
      }
    }

    fetchTrack()
  }, [trackId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!track) return

    try {
      await api.post("/track_reviews", {
        song_name: track.name,
        album_title: track.album,
        band_name: track.artist,
        spotify_song_id: track.id,
        spotify_url: track.spotify_url,
        spotify_artist_id: track.spotify_artist_id,
        album_art_url: track.album_art_url,
        review_text: form.reviewText,
        rating: parseInt(form.rating),
        things_loved: form.thingsLoved,
      })

      router.push("/user/home")
    } catch (err) {
      console.error("Failed to submit review", err)
    }
  }

  if (loadingUser || loadingTrack || !user || !track) {
    return (
      <Container mt="xl">
        <Loader />
      </Container>
    )
  }

  return (
    <LoggedInWrapper user={user}>
      <Title order={2} mb="sm">
        Write your track recommendation
      </Title>
      <Flex gap="md">
        {track.album_art_url && (
          <Image
            src={track.album_art_url}
            alt="Album Art"
            w={48}
            radius="md"
            mb="md"
          />
        )}
        <Flex direction="column">
          <Text lineClamp={1} fw={500}>
            {track.name}
          </Text>
          <Text size="sm" c="dimmed">
            {track.artist}
          </Text>
        </Flex>
      </Flex>
      <Paper component="form" onSubmit={handleSubmit}>
        <Stack>
          <Flex gap="5px" direction="column">
            <Text fw={500} size="sm">
              Overall Rating
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                { label: "It was okay", value: "0" },
                { label: "Liked it", value: "1" },
                { label: "Loved it!", value: "2" },
              ]}
              value={form.rating}
              onChange={(value) => setForm({ ...form, rating: value })}
            />
          </Flex>
          <Textarea
            label="Write a review (optional)"
            placeholder="What stood out to you?"
            value={form.reviewText}
            onChange={(e) =>
              setForm({ ...form, reviewText: e.currentTarget.value })
            }
            autosize
            minRows={6}
          />
          <MultiSelect
            label="What did you love about this track? (choose up to 3)"
            data={loveOptions}
            value={form.thingsLoved}
            onChange={(value) =>
              setForm({ ...form, thingsLoved: value.slice(0, 3) })
            }
            placeholder="Select up to 3"
            searchable
          />
          <Button type="submit" fullWidth>
            Submit Review
          </Button>
        </Stack>
      </Paper>
    </LoggedInWrapper>
  )
}
