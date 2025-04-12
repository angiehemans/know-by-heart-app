import {
  Anchor,
  Pill,
  PillGroup,
  Text,
  Stack,
  Flex,
  ActionIcon,
  Image,
  Divider,
  Code,
} from "@mantine/core"
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import api from "../utils/api" // Make sure this path is correct

interface Review {
  song_name: string
  band_name: string
  album_title?: string
  album_art_url?: string
  review_text?: string
  rating: number
  things_loved: string[]
  spotify_url: string
  spotify_song_id: string
  band_slug?: string
}

interface ReviewComponentProps {
  review: Review
}

const ratingLabels: Record<number, string> = {
  0: "It was okay",
  1: "Liked it",
  2: "Loved it!",
}

export function ReviewComponent({ review }: ReviewComponentProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      api
        .get("/bookmarks")
        .then((res) => {
          const bookmarked = res.data.some(
            (b: { spotify_song_id: string }) =>
              b.spotify_song_id === review.spotify_song_id
          )
          setIsBookmarked(bookmarked)
        })
        .catch((err) => console.warn("Error loading bookmarks", err))
    }
  }, [review.spotify_song_id])

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${review.spotify_song_id}`)
        setIsBookmarked(false)
      } else {
        await api.post("/bookmarks", {
          spotify_song_id: review.spotify_song_id,
          song_name: review.song_name,
          band_name: review.band_name,
          album_title: review.album_title,
          album_art_url: review.album_art_url,
          spotify_url: review.spotify_url,
        })
        setIsBookmarked(true)
      }
    } catch (err) {
      console.error("Bookmark failed", err)
    }
  }

  return (
    <Flex direction="column">
      <Flex gap="sm" justify="space-between" mb="xs">
        <Flex gap="sm">
          {review.album_art_url && (
            <Image
              src={review.album_art_url}
              width={48}
              height={48}
              alt="Album Art"
              radius="md"
            />
          )}
          <Flex direction="column">
            <Text lineClamp={1} fw={500}>
              {review.song_name}
            </Text>
            <Anchor href={`/band/${review.band_slug}`}>
              <Text size="sm" c="dimmed">
                {review.band_name}
              </Text>
            </Anchor>
          </Flex>
        </Flex>
        <ActionIcon
          onClick={handleBookmark}
          variant="subtle"
          color={isBookmarked ? "white" : "gray"}
          aria-label="Bookmark"
        >
          {isBookmarked ? (
            <IconBookmarkFilled size={20} />
          ) : (
            <IconBookmark size={20} />
          )}
        </ActionIcon>
      </Flex>
      <Flex gap="xs">
        <IconHeart size={20} />
        {review.things_loved.map((thing, i) => (
          <Code key={i}>{thing}</Code>
        ))}
      </Flex>
      {review.review_text && (
        <Text size="sm" mt="xs">
          {review.review_text}
        </Text>
      )}
      <Flex justify="space-between" align="center" my="xs">
        <Text size="sm" c="dimmed">
          Overall Rating: {ratingLabels[review.rating] ?? "Unknown"}
        </Text>
        <Anchor
          href={review.spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          Listen on Spotify
        </Anchor>
      </Flex>
      <Divider />
    </Flex>
  )
}
