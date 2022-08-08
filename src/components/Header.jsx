import { HStack, IconButton, Heading, useTheme } from "native-base";
import { CaretLeft }from "phosphor-react-native"
import { StyleSheet } from "react-native";

export function Header({ title, ...rest}) {


  const { colors } = useTheme()

  return (
    <HStack style={styles.container}
      bg={colors.primary[600]}
      {...rest}
    >
      <IconButton 
        icon={<CaretLeft color={colors.white} size={24} weight="bold"/>}
      />

      <Heading color={colors.white}  textAlign="left" fontSize="xl" flex={1} ml={4}>
        {title}
      </Heading>
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "full",
    justifyContent:"space-between",
    alignItems:"center",
    paddingBottom: 6,
    paddingTop: 12,
    paddingX:6,
  }
})

