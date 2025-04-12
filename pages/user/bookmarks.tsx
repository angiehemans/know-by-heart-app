import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Container, Loader, Stack, Text } from "@mantine/core"
import api, { clearAuthHeaders, setAuthHeaders } from "../../utils/api"
import { Track } from "../../components/Track"
import LoggedInWrapper from "../../components/LoggedInWrapper"

// --------------------
// Types
// --------------------

interface TrackData {
  id: string
  name: string
  artist: string
  album: string
  album_art_url?: string
  spotify_url: string
  band_slug?: string
}

interface User {
  id: number
  email: string
  username: string
}

export default function BookmarkedTracksPage() {
  const router = useRouter()
  const [bookmarkedTracks, setBookmarkedTracks] = useState<TrackData[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)

  // 1. Auth + user fetch
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
        const userRes = await api.get("/users/me")
        setUser(userRes.data)
      } catch (err) {
        console.warn("User fetch failed", err)
        clearAuthHeaders()
        router.push("/login")
      } finally {
        setLoadingUser(false)
      }
    }

    if (router.isReady) initialize()
  }, [router.isReady])

  // 2. Fetch bookmarks once user is loaded
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/bookmarks")

        const mappedTracks: TrackData[] = res.data.map((b: any) => ({
          id: b.spotify_song_id,
          name: b.song_name || "Untitled",
          artist: b.band_name || "Unknown Artist",
          album: b.album_title || "Unknown Album",
          album_art_url: b.album_art_url,
          spotify_url: b.spotify_url || "#",
          band_slug: b.band_slug,
        }))

        setBookmarkedTracks(mappedTracks)
      } catch (err) {
        console.error("Failed to load bookmarks", err)
      } finally {
        setLoadingBookmarks(false)
      }
    }

    if (!loadingUser && user) fetchBookmarks()
  }, [loadingUser, user])

  if (loadingUser) {
    return (
      <Container mt="xl">
        <Loader />
      </Container>
    )
  }

  const handleUnbookmark = async (trackId: string) => {
    try {
      await api.delete(`/bookmarks/${trackId}`)
      setBookmarkedTracks((prev) =>
        prev.filter((track) => track.id !== trackId)
      )
    } catch (err) {
      console.error("Failed to unbookmark track", err)
    }
  }

  return (
    <LoggedInWrapper user={user}>
      <Container>
        <Text size="xl" fw={700} mb="md">
          Your Bookmarked Tracks
        </Text>
        {loadingBookmarks ? (
          <Loader />
        ) : (
          <Stack>
            {bookmarkedTracks.length > 0 ? (
              bookmarkedTracks.map((track) => (
                <Track
                  key={track.id}
                  track={track}
                  showReviewButton
                  isBookmarked={true}
                  onToggleBookmark={() => handleUnbookmark(track.id)}
                />
              ))
            ) : (
              <Text color="dimmed">No bookmarks yet.</Text>
            )}
          </Stack>
        )}
      </Container>
    </LoggedInWrapper>
  )
}
