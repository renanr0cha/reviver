import * as Notifications from 'expo-notifications';

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

export async function setMedicineNotifications(medicine: Props) {
  console.log(medicine)

  const medId = medicine.id
  medicine.hours.forEach(hour => {

    const notificationHour = hour.slice(0, 2)
    const notificationMinute = hour.slice(3)
    
    Notifications.scheduleNotificationAsync({
      identifier: `${medicine.name}-${hour}`,
      content: {
        autoDismiss: false,
        sticky: true,
        title: `Você tem medicamento agora às ${hour} `,
        body: `${medicine.name} ${medicine.dosage} - Confirme que tomou apertando aqui`,
        priority: 'max',
        sound: "alarmsound.wav",
        vibrate: [0, 250, 250, 250],
        data: {
          medId,
          hour
        }
      },
      trigger: {
        channelId: "medicine",
        hour: Number(notificationHour),
        minute: Number(notificationMinute),
        repeats: true,
      },
      
    });
  });
  
}