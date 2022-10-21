import { useNavigation } from "@react-navigation/native";
import { HStack, IconButton, Heading, StyledProps, useTheme } from "native-base";
import { CaretLeft }from "phosphor-react-native"
import { THEME } from "../styles/theme";

type Props = StyledProps & {
  title: string
}

export function Header({ title, ...rest}: Props) {
  
  
  const navigation = useNavigation()

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
        onPress={() => navigation.goBack()}
      />

      <Heading color={colors.white}  textAlign="left" fontSize="xl" flex={1} ml={4}>
        {title}
      </Heading>
    </HStack>
  );
}

