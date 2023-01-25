import React from 'react';
import { Box, HStack, Pressable, Text, useTheme, VStack } from 'native-base';
import { Pill, Eyedropper, Alarm, Trash, PencilSimple, FirstAidKit } from 'phosphor-react-native';
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
  inventory: number,
  onPressDelete: any,
  onPressUpdate: any,
}

export function MedicineCard({medicineName, frequency, startTime, secondTime, thirdTime, fourthTime, dosage, endDate, inventory, onPressDelete, onPressUpdate}: MedicineCardProps) {
  const { colors } = useTheme()

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
            <HStack alignItems="center" textAlign="left" mb={6}>
              <Pill size={24} color={THEME.color.primary_800}/>
              <Text ml={2} fontSize="lg" fontWeight="bold" maxWidth='full' w={260} isTruncated>{medicineName}</Text>
            </HStack>
            <HStack>
              <Pressable alignItems="center" rounded="full" p={2} mr={2} onPress={onPressUpdate}>
                  <PencilSimple size={22} color={colors.text[600]}/>
              </Pressable>
              <Pressable alignItems="center" rounded="full" p={2} onPress={onPressDelete}>
                  <Trash size={22} color={colors.error[500]}/>
              </Pressable>
            </HStack>
          </HStack>
          <VStack alignItems="flex-start" space={3} textAlign="left">
            <HStack alignItems="center" textAlign="left">
              <Eyedropper size={20} color={colors.text[500]}/>
              <Text ml={2} fontSize="md" fontWeight="medium">{dosage}</Text>
              <Text fontWeight="medium" fontSize="md" > - {frequency} vezes por dia</Text>
            </HStack>
            <HStack alignItems="center" textAlign="left" width="100%" justifyContent="space-between">
              <HStack alignItems="center" textAlign="left">
                <Alarm size={20} color={colors.text[500]}/>
                <Text ml={2} fontWeight="medium" fontSize="md">{startTime}</Text>
                { secondTime && <Text fontWeight="medium" fontSize="md"> , {secondTime}</Text>}
                { thirdTime && <Text fontWeight="medium" fontSize="md"> , {thirdTime}</Text>}
                { fourthTime && <Text fontWeight="medium" fontSize="md"> , {fourthTime}</Text>}
              </HStack>
              { inventory ? (
                <HStack alignItems="center" textAlign="left" pr={1}>
                  <FirstAidKit size={20} color={colors.text[500]}/>
                  <Text ml={2} fontWeight="medium" fontSize="md">{String(inventory)} em estoque</Text>
                </HStack>
              ) : null}
            </HStack>
          </VStack>
        </Box>
      </VStack>
    )
}