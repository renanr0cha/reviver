import * as Notifications from 'expo-notifications';
import api from './api';

interface Props {
  name: string,
  notifications: string[],
  hours: string[],
  dosage: string,
  end_date?: string,
  medicine: Object,
}

export async function setScheduledNotifications( name: string, hours: string[], dosage: string) {
  Notifications.setNotificationChannelAsync(name, {
    name: name,
    importance: Notifications.AndroidImportance.MAX,
    lightColor: "#FF231F7C",
  })
  

  hours.forEach(hour => {
    const date = hour.split(":")
    console.log(`${date[0]}:${date[1]}`)
    Notifications.scheduleNotificationAsync({
      content: {
        autoDismiss: false,
        title: `Você tem medicamento às ${hour}`,
        body: `${name} ${dosage}`,
        priority: 'max',
        categoryIdentifier: 'buttons'
      },
      trigger: {
        hour: Number(date[0]),
        minute: Number(date[1]),
        repeats: true,
      },
    });
  });
  

}


