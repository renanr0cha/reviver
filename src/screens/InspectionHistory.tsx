import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "native-base";
import React, { useState, useEffect } from "react";
import WebView from "react-native-webview";
import { Header } from "../components/Header";

export function InspectionHistory() {

  const [uuid, setUuid] = useState("");

  useEffect(() => {
    getCredentials()
  }, [])

  async function getCredentials() {
    const uuidUser = await AsyncStorage.getItem('uuidUser')
    const uuidPatient = await AsyncStorage.getItem("uuidPatient")

    if (uuidPatient !== null) {
      setUuid(uuidPatient.slice(1))
      return
    }
    if (uuidUser !== null) {
      setUuid(uuidUser)
      return
    }
  }

  return(
    <>
      <Header title={"Progresso"} />
      <View flex={1} width="100%" height="100%">
        <WebView source={{
          uri: `http://reviver.cubecode.com.br/chart/inspection/${uuid}`
        }}/>
      </View>
    </>
  )
}

