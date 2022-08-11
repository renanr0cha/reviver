import { Box, VStack } from 'native-base';
import Logo from "../assets/logo-primary.svg"

export function SignIn() {
  return (
    <VStack>
      <Box mt={16}>
        <Logo />

      </Box>
    </VStack>
  );
}