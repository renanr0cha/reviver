import { Center, Spinner } from "native-base";

export function Loading() {
  return(
    <Center flex={1} bg="primary.50">
      <Spinner color="white" />
    </Center>
  )
}