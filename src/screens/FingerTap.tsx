import
  React,
  { useEffect,
    useState
  } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  Text,
  useTheme,
  useToast,
  VStack
} from 'native-base';
import { ButtonPrimary } from '../components/ButtonPrimary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteFormData, getFormData, storeFormData } from '../lib/storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../styles/theme';

type Nav = {
  navigate: (value: string) => void;
}

export function FingerTap() {

  const toast = useToast()
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()

  //state to modal countdown
  const [ visibleCount, setVisibleCount ] = useState(false);
  const [ secondsShow, setSecondsShow ] = useState(0);

  const [showSubmitButton, setShowSubmitButton] = useState(false)

  //states to count the touchs and count the 15 seconds timer
  const [ count, setCount ] = useState(0);
    const [ seconds, setSeconds ] = useState(0);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true)
  }, [])

  const Timer = () =>{
    let time = 0;
    const resp = setInterval(()=>{
        time += 1;
        setSeconds(time)

        if(time > 14){
            clearInterval(resp);
            setShowSubmitButton(true)
        }
    }, 1000)
  }
  const Count = () =>{
    let time = 4;
    const resp = setInterval(()=>{
      setVisibleCount(true)
        time -= 1;
        setSecondsShow(time)
        if(time <= 0){
            clearInterval(resp);
            setVisibleCount(false)
            setShowModal(false)
            Timer()
        }
    }, 1000)
  }

  const retrieveData = async () => {
    const resp = await getFormData()
    return resp
  }

  const deleteData = async () => {
    await deleteFormData()
  }

  function showToast() {
    toast.show({
      padding: 4,
      title: "Registro adicionado com sucesso!",
      placement: "bottom",
      duration: 2000 
    })
      
  }

  function handleReturnToHome() {
    navigation.navigate("home")
    deleteData()
    showToast()
  }


  //formsubmit
  const onSubmit = async (data: any) => {
    await storeFormData({
      finger_tap: data
    })

    const inspectionData = await retrieveData()
    const token = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")
    

    await api.post(`/${token}/inspection/create${isCaregiver ? isCaregiver : ""}`, inspectionData)
    .then((response) => {
      console.log(response.data.error)
      handleReturnToHome()
      
    })
    .catch(error => console.log(error.response))
    }

  return (
    <>
      <HStack
        w="full"
        justifyContent="center"
        alignItems="center"
        bg={THEME.color.primary}
        pb={4}
        pt={16}
        px={4}
        mb={10}
      >
        <Heading color={colors.white}  textAlign="left" fontSize="xl" ml={4} flex={1} >
          Teste de Finger Tap
        </Heading>
        </HStack>
      <VStack alignItems="center" justifyContent="space-between" flex={1} w="100%">
        <VStack alignItems="center" justifyContent="center" >
          <Heading color={colors.text[600]}mb={4} >Finger Tap</Heading>
          <Text w={300} textAlign="center" color={colors.text[600]} mb={8}>
            Usando seu dedo indicador, aperte o botão azul<Text fontWeight="bold">seguidamente o mais rápido que você puder</Text>
          </Text>
          <HStack px={20} mb={20} alignItems="center"justifyContent="space-around" w="100%">
            <HStack >
              <Text fontWeight="bold" mr={2}>CLIQUES:</Text>
              <Text fontWeight="bold">{count}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" mr={2}>TEMPO:</Text>
              <Text fontWeight="bold" >{seconds}</Text>
            </HStack>
          </HStack>
          <Button
            size="lg"
            rounded="full"
            w={250}
            bg={THEME.color.primary}
            _text={{ fontWeight: 'bold', fontSize: "2xl"}}
            h={250}
            _pressed={{ bg: THEME.color.primary_800}}
            onPress={()=> seconds===15 ? null : setCount(count + 1)}
            disabled={seconds === 15 ? true : false }
          >
            APERTE AQUI
          </Button>

        </VStack>
        { 
          showSubmitButton && 
          <>
            <Text w={300} textAlign="center" color={colors.text[600]} mb={2}>
              Parabéns, você finalizou o teste, aperte o botão abaixo para gravar seu registro
            </Text>
            <Box px={4} mt={2} pb={2} w="100%">
              <ButtonPrimary
                title="Finalizar registro"
                onPress={() => onSubmit(count)}
              />
            </Box>
          </>
        }
      </VStack>
      {visibleCount ? 
        (
          <Modal isOpen={visibleCount} closeOnOverlayClick={false} onClose={() => setVisibleCount(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.Header _text={{ fontWeight:"bold"}} >Carregando...</Modal.Header>
              <Modal.Body>
                <Text textAlign="center" fontSize="2xl">
                  {secondsShow}
                </Text>
              </Modal.Body>
              <Modal.Footer>
                
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )
      :
        (
          <Modal isOpen={showModal} closeOnOverlayClick={false} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.Header _text={{ fontWeight:"bold"}} >Teste de Finger Tap</Modal.Header>
              <Modal.Body>
                <Text>
                  Este teste consiste em apertar com o dedo indicador seguidamente e o mais rápido que conseguir na área delimitada da tela (neste caso o botão azul) durante 15 segundos
                </Text>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                  bg={THEME.color.primary}
                  _focus={{ bg: THEME.color.primary_800}}
                  _pressed={{ bg: THEME.color.primary_800}}
                  onPress={() => {
                    Count()
                  }}>
                    INICIAR
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )
      }
      
    </>
  );
}