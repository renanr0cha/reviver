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

  hours.forEach(hour => {
    const trigger = new Date(hour).getTime()
    Notifications.scheduleNotificationAsync({
      content: { 
        title: `Você tem medicamento às ${hour}`,
        body: `${name} ${dosage}`,
      },
      trigger,
    });
  });
  

}


