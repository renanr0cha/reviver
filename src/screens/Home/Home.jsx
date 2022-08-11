import { HStack, Heading, VStack, useTheme, IconButton, Box, Text } from "native-base";
import { SignOut, ChartLine, Pill, Clipboard } from "phosphor-react-native"
import { Button } from "../../components/Button";
import { CardMenu } from "../../components/CardMenu";


export function Home() {
  const { colors } = useTheme()
  return (
    <VStack flex={1}>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg={colors.primary[600]}
        pb={4}
        pt={12}
        px={4}
      >
        <Heading color={colors.white}  textAlign="left" fontSize="2xl" flex={1} >
        Olá Paciente
        </Heading>
        <IconButton
          icon={<SignOut size={26} color={colors.white} />}
        />
      </HStack>

      <CardMenu title="Progresso" subtitle="Acompanhe sua evolução" buttonTitle="ver evolução" icon={ChartLine}/>

      <CardMenu title="Medicamentos" subtitle="Veja seus medicamentos atuais e também adicione novos" buttonTitle="adicionar" secondButton="Ver lista" icon={Pill}/>

      <CardMenu title="Registrar sinais" subtitle="Adicione como você se sente, seus sintomas e medições" buttonTitle="adicionar registros" icon={Clipboard}/>

      <Button title="Gerenciar Notificações" mx={4} mt={4} bg={colors.red[500]}/>
    </VStack>
  );
}