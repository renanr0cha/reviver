import React from 'react';
import { Heading, Text, VStack } from 'native-base';
import { Header } from '../components/Header';
import { THEME } from '../styles/theme';

export function MedicineTakenInfo({route}) {

  console.log(route.params?.id)
  
  return (
    <VStack>
      <Header title="" />
      <VStack bg={THEME.color.primary} pl={8}>
        <Heading color="#FFFFFF" mb={2}>
          Paracetamol
        </Heading>
        <Text fontWeight="bold" color="#FFFFFF" mb={4}>
          45 comprimido(s) restantes
        </Text>
      </VStack>


    </VStack>
  );
}