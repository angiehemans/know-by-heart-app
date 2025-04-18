import {
  ActionIcon,
  Button,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core"
import { IconSun, IconMoon } from "@tabler/icons-react"
import cx from "clsx"
import classes from "./styles/darkmode.module.css"

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  })

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="light"
      color="gray"
      size="md"
      aria-label="Toggle color scheme"
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  )
}
