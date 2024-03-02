import { useNavigation } from "@react-navigation/native";
import { HStack, Heading, IconButton, StyledProps, useTheme } from "native-base";
import { CaretLeft } from "phosphor-react-native";
import { THEME } from "../styles/theme";

type Props = StyledProps & {
  title: string
}

type Nav = {
  navigate: (value: string) => void;
  goBack: () => void;
  canGoBack: () => boolean;
}

export function Header({ title, ...rest}: Props) {
  
  function handleReturnButton() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return
    }
    navigation.navigate("home")
  }
  const navigation = useNavigation<Nav>()

  const { colors } = useTheme()

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg={THEME.color.primary}
      pb={4}
      pt={10}
      px={4}
      {...rest}
      
    >
      <IconButton 
        icon={<CaretLeft color={colors.white} size={24}
        weight="bold"/>}
        _pressed={{ bg: THEME.color.primary_800}}
        onPress={handleReturnButton}
      />

      <Heading color={colors.white} allowFontScaling={false} textAlign="left" fontSize="xl" flex={1} ml={4}>
        {title}
      </Heading>
    </HStack>
  );
}

