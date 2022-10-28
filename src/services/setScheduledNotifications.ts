import * as Notifications from 'expo-notifications';
import api from './api';

interface Props {
  name: string,
  id: number,
  notifications: string[],
  hours: string[],
  dosage: string,
  inventory: number,
  end_date?: string,
  medicine: Object,
}

export async function setScheduledNotifications(medicine: Props) {

  medicine.hours.forEach(hour => {
    const date = hour.split(":")
    console.log(`${date[0]}:${date[1]}`)
    Notifications.scheduleNotificationAsync({
      content: {
        autoDismiss: false,
        title: `Você tem medicamento às ${hour} `,
        body: `${medicine.name} ${medicine.dosage}`,
        priority: 'max',
        categoryIdentifier: 'buttons',
        data: {
          id: medicine.id,
          inventory: medicine.inventory
        }
      },
      trigger: {
        hour: Number(date[0]),
        minute: Number(date[1]),
        repeats: true,
      },
    });
  });
  

}


