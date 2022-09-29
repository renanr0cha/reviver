import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeFormData = async (value: any) => {
  try {
    const oldData = await AsyncStorage.getItem('form_data')
    if (oldData != null) {
      const objOldData = JSON.parse(oldData)
      const mergedData = {...objOldData, ...value}
      const jsonValue = JSON.stringify(mergedData)
      await AsyncStorage.setItem('form_data', jsonValue)
    } else {
      const jsonValue = JSON.stringify( value)
      await AsyncStorage.setItem('form_data', jsonValue)

    }
  } catch (e) {
    console.log(e)
  }
}

export const deleteFormData = async () => {
  try {
    await AsyncStorage.removeItem('form_data')
    
  } catch (e) {
    console.log(e)
  }
}

export const getFormData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('form_data')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e)
  }
}
