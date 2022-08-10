import { VStack } from 'native-base';

export function CardMenu() {
  return (
    <VStack>
      <Box
        p={4}
        margin={8}
        rounded="lg"
        borderWidth={1}
        borderColor="coolGray.200"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box backgroundColor={colors.primary[600]} p={2} rounded={50} >
            <ChartLine size={42} color={colors.white} />
        </Box>
        <Box
        
          flexDirection="column"
          justifyContent="space-between"
        >
          
          <VStack pl={4} alignSelf="flex-start">
            <Heading fontSize="lg">Progresso</Heading>
            <Text>Acompanhe seus resultados</Text>
          </VStack>
          <ButtonSmall title="Ver evolução" h={12} mt={6} ml={24} p={4} alignSelf="flex-end"/>

        </Box>
        
      </Box>
    </VStack>
  );
}