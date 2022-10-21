import {
  HStack,
  Heading,
  VStack,
  useTheme,
  IconButton,
  Box
} from "native-base";
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SignOut, ChartLine, Pill, Clipboard, UserCircle } from "phosphor-react-native"
import { ButtonPrimary } from "../components/ButtonPrimary";
import { ButtonSmall } from "../components/ButtonSmall";
import { useAuth } from "../hooks/auth";
import { CardMenu } from "../components/CardMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteFormData } from "../lib/storage"
import { THEME } from '../styles/theme';


export function Home() {

  const [isCaregiver, setIsCaregiver] = useState()

  //check if you selected caregiver on login if yes, move to patientlist
  async function getRole() {
    try {
      const roleItem = await AsyncStorage.getItem("role")
      if (roleItem === "cuidador") {
        navigation.navigate("patientlist")
        await AsyncStorage.removeItem("role")
      }
    } catch(e) {
      console.log(e)
    }

    
  }
  getRole()


  const clearData = async () => {
    const resp = await deleteFormData()
    return resp
  }

  //check if is caregiver
  useFocusEffect(
    React.useCallback(() => {
      checkIfCaregiver()
      clearData()
    }, []))

    const checkIfCaregiver = async () => {
      const patientUuid = await AsyncStorage.getItem("uuidPatient")
      
      setIsCaregiver(patientUuid)
    }

  const { signOut } = useAuth();
  const { colors } = useTheme()
  
  // navigation functions
  const navigation = useNavigation()
  function handleNewMedicine() {
    navigation.navigate("addmed")
  }
  function handleNewInspection() {
    navigation.navigate("addinfo1")
  }
  //temp
  function handleMedicineList() {
    navigation.navigate("medlist")
  }
  
  function handleChangePatient() {
    navigation.navigate("patientlist")
  }

  return (
    <>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg={THEME.color.primary}
        pb={4}
        pt={10}
        px={4}
      >
        <Heading color={colors.white}  textAlign="left" fontSize="xl" flex={1} >
          Olá, {!isCaregiver ? "Paciente" : "Cuidador"}
        </Heading>
        {
          isCaregiver &&
            <IconButton
              icon={<UserCircle size={26} color={colors.white} />}
              onPress={handleChangePatient}
              borderRadius="full"
              bgColor={THEME.color.primary}
              _pressed={{
                bg: THEME.color.primary_800
              }}
            />
        }
        <IconButton
          icon={<SignOut size={26} color={colors.white} />}
          onPress={signOut}
          borderRadius="full"
          bgColor={THEME.color.primary}
          _pressed={{
            bg: THEME.color.primary_800
          }}
        />
      </HStack>
      <VStack flex={1} bg={colors.white} justifyContent="space-between">
        <VStack justifyContent="space-between">
          <CardMenu title="Progresso" subtitle="Acompanhe sua evolução" buttonTitle="ver evolução" icon={ChartLine}>
            <HStack alignSelf="flex-end">
              <ButtonSmall title="Ver evolução" h={12} mt={2} p={4} onPress={handleNewInspection}/>
            </HStack>
          </CardMenu>
          <CardMenu title="Medicamentos" subtitle="Veja seus medicamentos atuais e também adicione novos" buttonTitle="adicionar" secondButton="Ver lista" icon={Pill}>
            <HStack alignSelf="flex-end">
              <ButtonSmall title="adicionar" h={12} mt={2} p={4} onPress={handleNewMedicine}/>
              <ButtonSmall title="ver lista" onPress={handleMedicineList} h={12} mt={2} p={4} ml={4}/>
            </HStack>
          </CardMenu>
          <CardMenu title="Registrar sinais" subtitle="Adicione como você se sente, seus sintomas e medições" buttonTitle="adicionar registros" onPress={handleNewInspection} icon={Clipboard}>
            <HStack alignSelf="flex-end">
              <ButtonSmall title="adicionar registros" h={12} mt={2} p={4} onPress={handleNewInspection}/>
            </HStack>
          </CardMenu>
          
        </VStack>
      </VStack>
    </>
  );
}