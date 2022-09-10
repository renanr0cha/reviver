import { useNavigation } from "@react-navigation/native";
import { HStack, IconButton, Heading, StyledProps, useTheme } from "native-base";
import { CaretLeft }from "phosphor-react-native"

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
      bg={colors.primary[600]}
      pb={4}
      pt={10}
      px={4}
      {...rest}
      
    >
      <IconButton 
        icon={<CaretLeft color={colors.white} size={24} weight="bold"/>} onPress={() => navigation.goBack()}
      />

      <Heading color={colors.white}  textAlign="left" fontSize="xl" flex={1} ml={4}>
        {title}
      </Heading>
    </HStack>
  );
}

