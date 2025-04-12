import { GetServerSideProps } from "next"
import {
  Container,
  Title,
  Text,
  Stack,
  Image,
  Anchor,
  Divider,
  Flex,
  ActionIcon,
  BackgroundImage,
} from "@mantine/core"
import Head from "next/head"
import Link from "next/link"
import { IconHome } from "@tabler/icons-react"
import { ReviewComponent } from "../../components/ReviewComponent"
import axios from "axios"
import Footer from "../../components/Footer"

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
}

interface BandProfile {
  id: number
  name: string
  spotify_artist_id: string
  photo_url?: string
  slug: string
  reviews: Review[]
  review_count: number
}

interface Props {
  band: BandProfile | null
}

export default function BandProfilePage({ band }: Props) {
  if (!band) {
    return (
      <Container>
        <Title>Band not found</Title>
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
        <title>{`${band.name} | Know By Heart`}</title>
        <meta name="description" content={`Reviews of ${band.name}`} />
      </Head>

      <Container>
        <Flex justify="space-between" align="center" py="lg">
          <Text fw={700}>Know By Heart</Text>
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
        <Stack gap="md" my="md">
          {band.photo_url && (
            <BackgroundImage src={band.photo_url} h={200} p="md" radius="md">
              <Title order={1} c="white">
                {band.name}
              </Title>
            </BackgroundImage>
          )}
          <Text c="dimmed">
            {band.review_count} review{band.review_count !== 1 ? "s" : ""}
          </Text>
        </Stack>
        <Divider />
        <Title order={4} my="md">
          Community Reviews
        </Title>

        <Stack>
          {band.reviews.map((review, i) => (
            <ReviewComponent key={i} review={review} />
          ))}
        </Stack>
      </Container>
      <Footer />
    </>
  )
}

// ----------------------
// ✅ Server-Side Fetch
// ----------------------
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { slug } = context.params ?? {}

  if (!slug || typeof slug !== "string") {
    return { notFound: true }
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/bands/${slug}`
    )
    return {
      props: {
        band: res.data,
      },
    }
  } catch (err) {
    console.error("Failed to load band profile:", err)
    return {
      props: {
        band: null,
      },
    }
  }
}
