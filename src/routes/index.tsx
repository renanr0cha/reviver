import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Loading } from "../components/Loading";

import { AppRoutes } from "./app.routes"
import { AuthRoutes } from "./auth.routes"

import { useAuth } from "../hooks/auth"

const linking = {
  prefixes: ['reviver://'],
  config: {
    screens: {
      medtaken: {
        path: 'medtaken/:id/:identifier',
      },
      inforeminder: {
        path: 'inforeminder'
      }
    }
  }
}

export function Routes() {
  
  const { token, loading } = useAuth()
  if(loading){
    return(
      <Loading />
    )
  }

  return(
    <NavigationContainer linking={linking}>
      { token ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  )
}