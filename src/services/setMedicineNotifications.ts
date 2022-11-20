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

  medicine.hours.forEach(hour => {
    const date = hour.split(":")
    console.log(`${date[0]}:${date[1]}`)
    Notifications.scheduleNotificationAsync({
      identifier: "medicine",
      content: {
        autoDismiss: false,
        title: `Você tem medicamento agora às ${hour} `,
        body: `${medicine.name} ${medicine.dosage} - Confirme que tomou apertando aqui`,
        priority: 'max',
        sound: "../assets/alarm-sound.wav",
        data: {
          medicine
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


