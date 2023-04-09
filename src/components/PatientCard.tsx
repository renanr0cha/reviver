import React from 'react';
import { Box, Card, Heading, HStack, IconButton, Pressable, Text, useTheme, VStack, IPressableProps } from 'native-base';
import { BellSimple, Pill, Trash, User } from 'phosphor-react-native';
import { string } from 'yup';
import { THEME } from '../styles/theme';

type PatientCardProps = IPressableProps & {
  name: string,
  birthDate: string,
  cpf: string,
  phone: string,
  sex: string,
  onPressDelete: any
}

export function PatientCard({name, birthDate, cpf, phone, sex, onPressDelete, ...rest }: PatientCardProps) {
  const { colors } = useTheme()

      return (
          <VStack
          alignItems="center"
          px={4}
          w="100%">
            <Pressable
              {...rest}
              p={4}
              marginX={4}
              marginTop={4}
              rounded="lg"
              borderWidth={1}
              borderColor="coolGray.300"
              alignItems="flex-start"
              justifyContent="space-between"
              w="100%"
              _pressed={{
                backgroundColor: colors.blueGray[200]
              }}
            >
              <HStack alignItems="center" justifyContent="space-between"w="full">
                <HStack alignItems="center" textAlign="left" mb={4}>
                  <User size={28} color={THEME.color.primary_800}/>
                  <Text ml={2} fontSize="md" fontWeight="bold">{name}</Text>
                </HStack>
                <Pressable alignItems="center" rounded="full" mb={4} onPress={onPressDelete}>
                  <Trash size={22} color={colors.error[500]}/>
                </Pressable>
              </HStack>
              <VStack alignItems="flex-start" space={1} textAlign="left" mb={4}>
                <HStack alignItems="center" justifyContent="space-between" w="full" mb={2}>
                  <Text><Text fontWeight="bold">Data de nascimento: </Text>{birthDate}</Text>
                  <Text ml={2}><Text fontWeight="bold">Sexo: </Text>{sex}</Text>
                </HStack>
                <HStack alignItems="center" justifyContent="space-between" w="full">
                  <Text ><Text fontWeight="bold">Telefone: </Text>{phone}</Text>
                  <Text ml={2}><Text fontWeight="bold">CPF: </Text>{cpf}</Text>
                </HStack>
              </VStack>
            </Pressable>
          </VStack>
      );
    // }
  // }
  // // return({displayMedicine(medicines: any)}) 
  
}