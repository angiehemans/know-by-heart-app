import { GetServerSideProps } from "next"
import {
  Container,
  Title,
  Text,
  Stack,
  Image,
  Anchor,
  Avatar,
  Pill,
  PillGroup,
  Flex,
  Divider,
  ActionIcon,
  Button,
} from "@mantine/core"
import Head from "next/head"
import Link from "next/link"
import api from "../../utils/api"
import { ReviewComponent } from "../../components/ReviewComponent"
import { IconHome } from "@tabler/icons-react"

interface Review {
  song_name: string
  band_name: string
  album_title?: string
  review_text?: string
  rating: number
  things_loved: string[]
  spotify_url: string
  spotify_song_id: string
}

interface UserProfile {
  username: string
  about_me?: string
  profile_picture_url?: string
  reviews: Review[]
}

interface Props {
  profile: UserProfile | null
}

const ratingLabels: Record<number, string> = {
  0: "It was okay",
  1: "Liked it",
  2: "Loved it!",
}

export default function PublicProfilePage({ profile }: Props) {
  if (!profile) {
    return (
      <Container>
        <Title>User not found</Title>
        <Text mt="md">
          <Anchor component={Link} href="/user/home">
            Return to home
          </Anchor>
        </Text>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>{profile.username} | GoodSongs ❤︎t</title>
        <meta name="description" content={`Reviews by ${profile.username}`} />
      </Head>

      <Container size="sm">
        <Flex justify="space-between" align="center" py="lg">
          <Text fw={700}>GoodSongs ❤︎</Text>
          <ActionIcon
            component={Link}
            href="/user/home"
            size="md"
            variant="subtle"
            color="gray"
          >
            <IconHome size={24} stroke={1.5} />
          </ActionIcon>
        </Flex>
        <Divider />
        <Flex gap="md" my="md" justify="space-between">
          <Title order={4}>@{profile.username}</Title>
          {profile.profile_picture_url && (
            <Avatar
              src={profile.profile_picture_url}
              alt="Profile Picture"
              radius="50%"
              size="lg"
            />
          )}
        </Flex>
        {profile.about_me && <Text size="sm">{profile.about_me}</Text>}
        <Flex justify="space-between" align="center" my="md">
          <Text size="sm" c="dimmed">
            {profile.reviews.length} reviews
          </Text>
          <Button size="compact-xs" variant="light" color="gray">
            follow
          </Button>
        </Flex>
        <Divider />
        <Title order={4} my="md">
          My Reviews
        </Title>

        <Stack>
          {profile.reviews.map((review, i) => (
            <ReviewComponent key={i} review={review} />
          ))}
        </Stack>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params || {}

  if (!username || typeof username !== "string") {
    return { notFound: true }
  }

  try {
    const res = await api.get(`/profiles/${username}`)
    return {
      props: {
        profile: res.data,
      },
    }
  } catch (err) {
    console.error("Error fetching profile:", err)
    return {
      notFound: true,
    }
  }
}
