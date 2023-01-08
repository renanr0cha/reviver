import React from 'react';
import { Box, Card, Heading, HStack, IconButton, Pressable, Text, useTheme, VStack } from 'native-base';
import { BellSimple, Pill, Eyedropper, Alarm, Trash, PencilSimple } from 'phosphor-react-native';
import { string } from 'yup';
import { THEME } from '../styles/theme';

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
        <VStack alignItems="center" px={2} w="100%" >
          <Box
            p={2}
            marginX={2}
            marginTop={2}
            rounded="lg"
            borderWidth={1}
            borderColor="coolGray.50"
            alignItems="flex-start"
            justifyContent="space-between"
            backgroundColor='white'
            shadow={1}
            w="100%"
          >
            <HStack justifyContent="space-between" w='100%'>
              <HStack alignItems="center" textAlign="left" mb={4}>
                <Pill size={24} color={THEME.color.primary_800}/>
                <Text ml={2} fontSize="lg" fontWeight="bold" maxWidth='full' w={260} isTruncated>{medicineName}</Text>
              </HStack>
              <HStack>
                <Pressable alignItems="center" rounded="full" p={2} mr={2}>
                    <PencilSimple size={22} color={colors.text[600]}/>
                </Pressable>
                <Pressable alignItems="center" rounded="full" p={2}>
                    <Trash size={22} color={colors.error[500]}/>
                </Pressable>
              </HStack>
            </HStack>
            <VStack alignItems="flex-start" space={1} textAlign="left" mb={4}>
              <HStack alignItems="center" textAlign="left" mb={2}>
                <Eyedropper size={20} color={colors.text[500]}/>
                <Text ml={2} fontSize="md" fontWeight="medium">{dosage}</Text>
                <Text fontWeight="medium" fontSize="md" > - {frequency} vezes por dia</Text>
              </HStack>
              <HStack alignItems="center" textAlign="left">
                <Alarm size={20} color={colors.text[500]}/>
                <Text ml={2} fontWeight="medium" fontSize="md">{startTime}</Text>
                { secondTime && <Text fontWeight="medium" fontSize="md"> , {secondTime}</Text>}
                { thirdTime && <Text fontWeight="medium" fontSize="md"> , {thirdTime}</Text>}
                { fourthTime && <Text fontWeight="medium" fontSize="md"> , {fourthTime}</Text>}
  
              </HStack>
            </VStack>
            <HStack alignItems="center" justifyContent="space-between" w="full">
              <Box bgColor={THEME.color.primary_200} borderRadius="full">
                <Text p={2} >Até {endDate}</Text>
                
              </Box>
              <Box bgColor={THEME.color.primary_200} borderRadius="full" >
                { inventory && <Text p={2}>Possuí {String(inventory)} em estoque</Text>}
              </Box>
              <Box alignSelf="flex-end">
                <IconButton
                  icon={<BellSimple size={18} color={colors.white} weight="bold"/>}
                  borderRadius="full"
                  bgColor={THEME.color.primary}
                  _pressed={{
                    bg: THEME.color.primary_800
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