import {
  Button,
  Text,
  Image,
  Flex,
  ActionIcon,
  Tooltip,
  Paper,
  Divider,
  Anchor,
} from "@mantine/core"
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCheck,
  IconMessage2Heart,
} from "@tabler/icons-react"
import Link from "next/link"

interface TrackData {
  id: string
  name: string
  artist: string
  album: string
  album_art_url?: string
  spotify_url: string
  band_slug?: string
}

interface TrackProps {
  track: TrackData
  isReviewed?: boolean
  isBookmarked?: boolean
  onToggleBookmark?: (track: TrackData) => void
  showReviewButton?: boolean
}

export function Track({
  track,
  isReviewed = false,
  showReviewButton = true,
  isBookmarked = false,
  onToggleBookmark,
}: TrackProps) {
  return (
    <Paper>
      <Flex justify="space-between" gap="sm" direction="row">
        <Flex gap="sm">
          {track.album_art_url && (
            <Image
              src={track.album_art_url}
              width={48}
              height={48}
              alt="Album Art"
              radius="md"
            />
          )}
          <Flex direction="column">
            <Text lineClamp={1} fw={500}>
              {track.name}
            </Text>
            {track.band_slug ? (
              <Anchor component={Link} href={`/band/${track.band_slug}`}>
                <Text size="sm" c="dimmed">
                  {track.artist}
                </Text>
              </Anchor>
            ) : (
              <Text size="sm" c="dimmed">
                {track.artist}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex gap="sm">
          {isReviewed ? (
            <Tooltip label="You already reviewed this track" withArrow>
              <ActionIcon
                variant="subtle"
                disabled
                color="green"
                aria-label="Reviewed"
              >
                <IconCheck size={24} stroke={2} />
              </ActionIcon>
            </Tooltip>
          ) : (
            showReviewButton && (
              <Link href={`/review/${track.id}`}>
                <Tooltip label="Review this track" withArrow>
                  <ActionIcon variant="subtle" color="gray" aria-label="Review">
                    <IconMessage2Heart size={24} stroke={2} />
                  </ActionIcon>
                </Tooltip>
              </Link>
            )
          )}
          <ActionIcon
            variant="subtle"
            color={isBookmarked ? "blue" : "gray"}
            onClick={() => onToggleBookmark?.(track)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark for later"}
          >
            {isBookmarked ? (
              <IconBookmarkFilled size={24} stroke={2} />
            ) : (
              <IconBookmark size={24} stroke={2} />
            )}
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider mt="md" />
    </Paper>
  )
}
