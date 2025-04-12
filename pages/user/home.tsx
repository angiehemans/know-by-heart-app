import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Container, Text, Loader, Stack } from "@mantine/core"
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

interface Review {
  spotify_song_id: string
}

interface User {
  id: number
  email: string
  username: string
}

interface Bookmark {
  spotify_song_id: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tracks, setTracks] = useState<TrackData[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [bookmarkedTrackIds, setBookmarkedTrackIds] = useState<Set<string>>(
    new Set()
  )

  // 1. Auth check and user fetch
  useEffect(() => {
    const initialize = async () => {
      const queryToken = router.query.token as string | undefined
      const storedToken = localStorage.getItem("token")

      if (queryToken) {
        setAuthHeaders(queryToken)
      } else if (storedToken) {
        setAuthHeaders(storedToken)
      } else {
        console.warn("No auth token found")
        router.push("/login")
        return
      }

      try {
        const userRes = await api.get("/users/me")
        const userData: User = userRes.data

        if (!userData.username) {
          router.push("/user/onboarding")
          return
        }

        setUser(userData)
      } catch (err) {
        console.warn("User fetch failed", err)
        clearAuthHeaders()
        router.push("/login")
      } finally {
        setLoadingUser(false)
      }
    }

    if (router.isReady) {
      initialize()
    }
  }, [router.isReady, router])

  // 2. Fetch reviews and Spotify tracks after user is known
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, tracksRes] = await Promise.all([
          api.get<Review[]>("/track_reviews"),
          api.get<{ tracks: TrackData[] }>("/spotify/recent_tracks"),
        ])
        setReviews(reviewsRes.data)
        setTracks(tracksRes.data.tracks)
      } catch (err) {
        console.warn("Error loading user data:", err)
      } finally {
        setLoadingData(false)
      }
    }

    if (!loadingUser && user) {
      fetchData()
    }
  }, [loadingUser, user])

  // 3. Load bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get<Bookmark[]>("/bookmarks")
        setBookmarkedTrackIds(new Set(res.data.map((b) => b.spotify_song_id)))
      } catch (err) {
        console.warn("Could not load bookmarks:", err)
      }
    }

    if (!loadingUser && user) {
      fetchBookmarks()
    }
  }, [loadingUser, user])

  // 4. Toggle bookmark
  const handleToggleBookmark = async (track: TrackData) => {
    const isBookmarked = bookmarkedTrackIds.has(track.id)

    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${track.id}`)
        setBookmarkedTrackIds((prev) => {
          const next = new Set(prev)
          next.delete(track.id)
          return next
        })
      } else {
        await api.post("/bookmarks", {
          spotify_song_id: track.id,
          song_name: track.name,
          band_name: track.artist,
          album_art_url: track.album_art_url,
          album_title: track.album,
          spotify_url: track.spotify_url,
        })
        setBookmarkedTrackIds((prev) => new Set(prev).add(track.id))
      }
    } catch (err) {
      console.error("Bookmark error:", err)
    }
  }

  // 5. Loading
  if (loadingUser) {
    return (
      <Container mt="xl">
        <Loader />
      </Container>
    )
  }

  const reviewedTrackIds = new Set(reviews.map((r) => r.spotify_song_id))

  return (
    <LoggedInWrapper user={user}>
      <Container fluid p={0}>
        <Text size="xl" fw={700} mb="md">
          Recently Played Tracks
        </Text>

        {loadingData ? (
          <Loader />
        ) : (
          <Stack>
            {tracks.length > 0 ? (
              tracks.map((track) => (
                <Track
                  key={track.id}
                  track={track}
                  isReviewed={reviewedTrackIds.has(track.id)}
                  isBookmarked={bookmarkedTrackIds.has(track.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))
            ) : (
              <Text c="dimmed">
                No recent Spotify tracks found or unable to fetch.
              </Text>
            )}
          </Stack>
        )}
      </Container>
    </LoggedInWrapper>
  )
}
