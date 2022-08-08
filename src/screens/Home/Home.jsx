import { Header } from "../components/Header"
import { VStack, Box } from "native-base";


export function Home() {
  return (
    <VStack>
      <Header title="Nova medicação" />
      <Box flex={1} alignItems="center" justifyContent="center" color="black">Hello world!
      </Box>
    </VStack>
  );
}