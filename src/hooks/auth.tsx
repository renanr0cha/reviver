import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api"
import { Alert } from 'react-native';

interface AuthState {
  token: string
}

interface SignCredentials {
  cpf: string,
  password: string
}

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextData {
  token: string,
  loading: boolean,
  signIn(credentials: SignCredentials): Promise<void>,
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, isLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const token = await AsyncStorage.getItem('token')

      if (token) {
        setData({ token })
      }
      isLoading(false)
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ cpf, password }:SignCredentials) => {
    await api.post('/login', {
      cpf,
      password
    }).then(async response => {
      const { token } = response.data
      if (token === "paciente" || token === "cuidador") {
        return Alert.alert("CPF ou Senha incorreta")
      }
      await AsyncStorage.setItem('token', token)
      setData({ token })
    }).catch(error => {
      error.response.data.error === "Unauthorized" ?
      Alert.alert("CPF ou Senha incorreta") : console.log(error.response.data.error)
    })
    
    
    
    

    


    
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('uuidPatient')
    await AsyncStorage.removeItem('token')

    setData({} as AuthState)
  }, [])

  return(
    <AuthContext.Provider value={{ token: data.token, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }