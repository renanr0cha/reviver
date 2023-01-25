import { useNavigation } from '@react-navigation/native';
import { Box, Heading, HStack, Pressable, Text, useToast, VStack } from 'native-base';
import { CheckCircle } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { setInspectionNotifications } from '../services/setInspectionNotifications';
import { THEME } from '../styles/theme';

type Frequency = "daily" | "weekly"

export function InspectionReminders() {

  const toast = useToast()
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<Frequency>("weekly")

  function handleInspectionReminder(mode: "daily" | "weekly") {
    setIsLoading(true)
    setInspectionNotifications(mode)
    addToast()
    setIsLoading(false)
    navigation.goBack()
  }

  function addToast() {
    toast.show({
      padding: 4,
      title: `Suas preferências foram salvas. Os lembretes serão enviados ${mode === "daily" ? "Uma vez por dia" : "Uma vez por semana"}!`,
      placement: "bottom",
      duration: 2000,
    })
  }

  return (
    <VStack
      w="full"
      backgroundColor="white"
      flex={1}
    >
      <Header title="Lembretes de Registros" />
      <Heading p={4} mt={8}>
        Ajuste como e quando quer ser lembrado de fazer seus registros
      </Heading>
      <Text
        p={4}
        fontSize="md"
      >
        Por favor, selecione a frequência do lembrete abaixo:
      </Text>
      <HStack justifyContent="space-between" alignItems="flex-start" p={4} >
        <Pressable
          p={8}
          w={160}
          h={120}
          borderWidth={1}
          borderColor={THEME.color.primary_200}
          borderRadius="md"
          shadow={mode === "daily" ? "5" : "3"}
          backgroundColor={mode === "daily" ? THEME.color.primary_200 : "white"}
          onPress={() => setMode("daily")}
          justifyContent="flex-end"
          alignItems="center"

          _pressed={{ shadow: "5", backgroundColor: THEME.color.primary_200 }}
        >
            {mode === "daily" && <CheckCircle size={32}  color="green" />}
            <Text
              textAlign="center"
              fontSize="md"
              fontWeight={mode === "daily" ? "bold" : "semibold"}
              mt={mode === "daily" ? 2 : 0}
              underline={mode === "daily" ? true : false}
            >
              Diário
            </Text>
        </Pressable>
        <Pressable
          p={8}
          w={160}
          h={120}
          borderWidth={1}
          borderColor={THEME.color.primary_200}
          borderRadius="md"
          shadow={mode === "weekly" ? "5" : "3"}
          backgroundColor={mode === "weekly" ? THEME.color.primary_200 : "white"}
          onPress={() => setMode("weekly")}
          justifyContent="flex-end"
          alignItems="center"
          _pressed={{ shadow: "5", backgroundColor: THEME.color.primary_200 }}
        >
            {mode === "weekly" && <CheckCircle size={32}  color="green" />}
            <Text
              textAlign="center"
              fontSize="md"
              fontWeight={mode === "weekly" ? "bold" : "semibold"}
              mt={mode === "weekly" ? 2 : 0}
              underline={mode === "weekly" ? true : false}
            >
              Semanal
            </Text>
        </Pressable>

    </HStack>
    <Text
        p={4}
        fontSize="sm"
      >
        Os lembretes serão feitos as 10:30 da manhã, e caso a escolha seja semanalmente, toda segunda-feira
      </Text>
    <Box px={4} mt={10} pb={2} w="100%">
        <ButtonPrimary
          title="Salvar escolha"
          w="full"
          onPress={() => handleInspectionReminder(mode)}
          isLoading={isLoading} />
      </Box>
    </VStack>
  );
}