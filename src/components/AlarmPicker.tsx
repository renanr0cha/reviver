import React, { useState } from 'react'
import { Icon, IconButton, useTheme } from 'native-base'
import DatePicker from 'react-native-date-picker'
import { Clock } from 'phosphor-react-native'

export function AlarmPicker({...rest}) {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const { colors } = useTheme()

  return (
    <>
      <IconButton icon={<Icon as={Clock}/> } size={8} borderRadius="full" _icon={{
      color: "orange.500"
      }} mr={2} onPress={() => setOpen(true)} />
        <DatePicker
          {...rest}
          modal
          mode='time'
          locale="pt-BR"
          is24hourSource="locale"
          open={open}
          date={date}
          onConfirm={(date) => {
            setOpen(false)
            setDate(date)
          }}
          onCancel={() => {
            setOpen(false)
          }}
        />
    </>
  )
}