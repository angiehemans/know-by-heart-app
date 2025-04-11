// components/PageTemplate.tsx
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  NavLink,
  Paper,
  Text,
} from "@mantine/core"
import { useRouter } from "next/router"
import { clearAuthHeaders } from "../utils/api"
import { ReactNode } from "react"
import {
  IconBookmark,
  IconHome,
  IconLogout,
  IconMessage2Heart,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"
import classes from "./styles/wrapper.module.css"
import { ColorSchemeToggle } from "./ColorSchemeToggle"
import Footer from "./Footer"

interface User {
  id: number
  email: string
  username: string
}

interface LoggedInWrapperProps {
  children: ReactNode
  user: User | null
}

export default function LoggedInWrapper({
  children,
  user,
}: LoggedInWrapperProps) {
  const router = useRouter()

  return (
    <Container size="sm">
      <Flex justify="space-between" align="center" py="lg">
        <Text fw={700}>Know By Heart</Text>
        <Flex gap="lg">
          <ColorSchemeToggle />
        </Flex>
      </Flex>

      <Flex direction="column" className={classes.root}>
        <Paper shadow="xs" withBorder p={0} mb={10}>
          <Flex gap="xl" justify="center" p="xs">
            <ActionIcon
              component="a"
              href="/user/home"
              variant="subtle"
              color="gray"
              aria-label="Home"
              size="lg"
            >
              <IconHome size={24} stroke={2} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Review"
            >
              <IconMessage2Heart size={24} stroke={2} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href={`/me/${user?.username}`}
              variant="subtle"
              color="gray"
              aria-label="Profile"
              size="lg"
            >
              <IconUser size={24} stroke={2} />
            </ActionIcon>

            <ActionIcon
              component="a"
              href="/user/bookmarks"
              variant="subtle"
              color="gray"
              aria-label="Bookmarks"
              size="lg"
            >
              <IconBookmark size={24} stroke={2} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="/user/settings"
              variant="subtle"
              color="gray"
              aria-label="Settings"
              size="lg"
            >
              <IconSettings size={24} stroke={2} />
            </ActionIcon>
          </Flex>
        </Paper>
      </Flex>
      {children}
      <Footer />
    </Container>
  )
}
