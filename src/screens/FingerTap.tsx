import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, HStack, Modal, Text, useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';
import { BackHandler } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';

export function FingerTap() {
  const { colors } = useTheme()

  //state to modal countdown
  const [ visibleCount, setVisibleCount ] = useState(false);
  const [ secondsShow, setSecondsShow ] = useState(0);

  const [showSubmitButton, setShowSubmitButton] = useState(false)

  //states to count the touchs and count the 15 seconds timer
  const [ count, setCount ] = useState(0);
    const [ seconds, setSeconds ] = useState(0);

    const [ loading, setLoading ] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true)
  }, [])

  showSubmitButton && console.log(count)

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
    setVisibleCount(true)
    let time = 4;
    const resp = setInterval(()=>{
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

  return (
    <>
      <HStack
        w="full"
        justifyContent="center"
        alignItems="center"
        bg={colors.primary[600]}
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
          <Text w={300} textAlign="center" color={colors.text[600]} mb={8}>Usando seu dedo indicador, aperte o botão azul <Text fontWeight="bold">seguidamente o mais rápido que você puder</Text></Text>
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
            rounded="43%"
            w={250}
            bg={colors.blue[500]}
            _text={{ fontWeight: 'bold', fontSize: "2xl"}}
            h={250}
            onPress={()=> seconds===15 ? null : setCount(count + 1)}
            disabled={seconds === 15 ? true : false }
          >
            APERTE AQUI
          </Button>

        </VStack>
        { 
          showSubmitButton && 
          <>
            <Text w={300} textAlign="center" color={colors.text[600]} mb={2}> Parabéns, você finalizou o teste, aperte o botão abaixo para gravar seu registro</Text>
            <Box px={4} mt={2} pb={2} w="100%">
              <ButtonPrimary title="Finalizar registro" />

            </Box>
          </>
        }
      </VStack>
      {visibleCount ? 
        (
          <Modal isOpen={visibleCount} onClose={() => setVisibleCount(false)}>

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
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                  <Modal.Header _text={{ fontWeight:"bold"}} >Teste de Finger Tap</Modal.Header>
                  <Modal.Body>
                    <Text>
                      Este teste consiste em apertar com o dedo indicador seguidamente e o mais rápido que conseguir na área delimitada da tela (neste caso o botão azul) durante 15 segundos
                    </Text>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button onPress={() => {
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