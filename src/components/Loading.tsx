import { Center, Spinner } from "native-base";
import { THEME } from "../styles/theme";

export function Loading() {
  return(
    <Center flex={1} bg={THEME.color.primary_200}>
      <Spinner color={THEME.color.primary} />
    </Center>
  )
}