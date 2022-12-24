import * as Notifications from 'expo-notifications';

interface Props {
  name: string,
  id: number,
  notifications: string[],
  hours: string[],
  dosage: string,
  inventory: number | null,
  end_date?: string,
  medicine: Object,
}

export async function setMedicineNotifications(medicine: Props) {

  medicine.hours.forEach(hour => {
    const date = hour.split(":")
    
    Notifications.scheduleNotificationAsync({
      identifier: `${medicine.name}`,
      content: {
        autoDismiss: false,
        sticky: true,
        title: `Você tem medicamento agora às ${hour} `,
        body: `${medicine.name} ${medicine.dosage} - Confirme que tomou apertando aqui`,
        priority: 'max',
        sound: "alarm_sound.wav",
        data: {
          medicine
        }
      },
      trigger: {
        channelId: "medicine",
        hour: Number(date[0]),
        minute: Number(date[1]),
        repeats: true,
      },
      
    });
  });
  

}


