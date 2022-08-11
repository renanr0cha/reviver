import { HStack, Heading, VStack, useTheme, IconButton, Box, Text } from "native-base";
import { SignOut, ChartLine, Pill } from "phosphor-react-native"
import { Button } from "../../components/Button";
import { ButtonSmall } from "../../components/ButtonSmall";
import { CardMenu } from "../../components/CardMenu";


export function Home() {
  const { colors } = useTheme()
  return (
    <VStack>
      <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg={colors.primary[600]}
      pb={4}
      pt={12}
      px={4}
      >
        <Heading color={colors.white}  textAlign="left" fontSize="xl" flex={1} ml={4}>
        Olá Paciente
        </Heading>
        <IconButton
          icon={<SignOut size={26} color={colors.white} />}
        />
      </HStack>
      <Box
        p={4}
        margin={8}
        rounded="lg"
        borderWidth={1}
        borderColor="coolGray.200"
        flexDirection="row"
        alignItems="center"
      >
        <Box backgroundColor={colors.primary[500]} p={2} mr={4} rounded={50} >
            <ChartLine size={38} color={colors.white} />
        </Box>
        
          
          <VStack
            flex={1}
            justifyContent="flex-end"
            borderWidth={1}
            borderColor="red"
            alignItems="center"
          >
            <Heading fontSize="lg" alignSelf="flex-start">Progresso</Heading>
            <Text alignSelf="flex-start">Acompanhe seus resultados</Text>
            <ButtonSmall title="Ver evolução" h={12} mt={6}  alignSelf="flex-end"/>
          </VStack>
        
      </Box>

      <CardMenu title="Medicamentos" subtitle="Veja seus medicamentos" buttonTitle="adicionar" icon={Pill}/>


      <Button title="Adicionar" m={8} alignSelf="flex-end"/>
    </VStack>
  );
}