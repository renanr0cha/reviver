import React from 'react';
import { Box, Card, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import { BellSimple, Pill } from 'phosphor-react-native';
import { string } from 'yup';

type MedicineCardProps = {
  medicineName: string,
  frequency: string,
  startTime: string,
  secondTime?: string,
  thirdTime?: string,
  fourthTime?: string,
  dosage: string,
  days: string,
  endDate: string,
  inventory: number
}

export function MedicineCard({medicineName, frequency, startTime, secondTime, thirdTime, fourthTime, dosage, endDate, inventory}: MedicineCardProps) {
  const { colors } = useTheme()

  // const displayMedicine = (medicines: any) => {
      return (
        <VStack alignItems="center" px={4} w="100%" >
          <Box
            p={4}
            marginX={4}
            marginTop={4}
            rounded="lg"
            borderWidth={1}
            borderColor="coolGray.300"
            alignItems="flex-start"
            justifyContent="space-between"
            w="100%"
          >
            <HStack alignItems="center" textAlign="left" mb={2}>
              <Pill size={28} color={colors.text[600]}/>
              <Text ml={2} fontSize="md" fontWeight="bold">{medicineName}</Text>
            </HStack>
            <VStack alignItems="flex-start" space={1} textAlign="left" mb={4}>
              
                <Text fontWeight="bold" mb={1}>{dosage} {frequency} vezes por dia</Text>
    
                <HStack>
                  <Text>{startTime}</Text>
                  { secondTime && <Text>, {secondTime}</Text>}
                  { thirdTime && <Text>, {thirdTime}</Text>}
                  { fourthTime && <Text>, {fourthTime}</Text>}
    
                </HStack>
            </VStack>
            <HStack alignItems="center" justifyContent="space-between" w="full">
              <Box bgColor={colors.primary[100]} borderRadius="full">
                <Text p={2} >Até {endDate}</Text>
                
              </Box>
              <Box bgColor={colors.primary[100]} borderRadius="full" >
                { inventory && <Text p={2}>Possuí {String(inventory)} em estoque</Text>}
              </Box>
              <Box alignSelf="flex-end">
                <IconButton
                  icon={<BellSimple size={18} color={colors.white} weight="bold"/>}
                  borderRadius="full"
                  bgColor={colors.primary[400]}
                  _pressed={{
                    bg: colors.primary[700]
                  }}
                  
                />
    
              </Box>
            </HStack>
          </Box>
        </VStack>
      );
    // }
  // }
  // // return({displayMedicine(medicines: any)}) 
  
}