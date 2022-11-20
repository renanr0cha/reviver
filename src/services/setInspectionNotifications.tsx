import * as Notifications from 'expo-notifications';

export async function setInspectionNotifications(mode: "daily" | "weekly") {
  
  Notifications.scheduleNotificationAsync({
    identifier: "inspection",
    content: {
      autoDismiss: false,
      title: `Não esqueça de adicionar seus registros`,
      body: `Aperte aqui para adicionar um registro com seus dados de saúde`,
      priority: 'max',
      sound: "alarm-sound.wav",
    },
    trigger: mode === "weekly" ? {
      weekday: 2,
      hour: 10,
      minute: 30,
      repeats: true,
    } : {
      hour: 10,
      minute: 30,
      repeats: true,
    },
    
  }); 
}