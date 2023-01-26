import { View } from "native-base";
import React, { useState } from "react";
import WebView from "react-native-webview";
import { Header } from "../components/Header";

export function InspectionHistory() {
  return(
    <>
      <Header title={"Progresso"} />
      <View flex={1} width="100%" height="100%">
        <WebView source={{ uri: 'https://infinite.red' }}/>
      </View>
    </>
  )
}

