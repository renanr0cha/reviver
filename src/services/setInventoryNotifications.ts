import * as Notifications from 'expo-notifications';
import { cancelNotifications } from './cancelNotifications';

interface Props {
  name: string,
  uuid: string,
  id: number,
  notifications: string[],
  hours: string[],
  dosage: string,
  inventory: number,
  end_date?: string,
  medicine: Object,
}

export async function setInventoryNotifications(medicine: Props, days: number) {
  const medId = medicine.uuid

  if (days > 14 ) {
    Notifications.cancelScheduledNotificationAsync(`${medId}-inventory`)
    Notifications.dismissNotificationAsync(`${medId}-inventory`)
  }
  if (days <= 14 && days > 7) {
    Notifications.cancelScheduledNotificationAsync(`${medId}-inventory`)
    Notifications.dismissNotificationAsync(`${medId}-inventory`)
    Notifications.scheduleNotificationAsync({
      identifier: `${medId}-inventory`,
      content: {
        autoDismiss: false,
        sticky: true,
        title: `Você só possui ${medicine.name} para mais ${Math.floor(days)} dias`,
        body: `Consiga uma nova receita caso preciso, ou renove seu estoque nos próximos dias`,
        priority: 'max',
        sound: "notification.mp3",
        categoryIdentifier: "okButton",
        vibrate: [0, 250, 250, 250],
        data: {
          medId
        }
      },
      trigger: {
        channelId: 'inventory',
        hour: 9,
        minute: 30,
        repeats: true,
      },
    });
  }

  if (days <= 7 && days > 0) {
    Notifications.cancelScheduledNotificationAsync(`${medId}-inventory`)
    Notifications.dismissNotificationAsync(`${medId}-inventory`)
    Notifications.scheduleNotificationAsync({
      identifier: `${medId}-inventory`,
      content: {
        autoDismiss: false,
        sticky: true,
        title: `ATENÇÃO: Você só possui ${medicine.name} para mais ${Math.floor(days)} dias`,
        body: `Consiga uma nova receita e/ou renove seu estoque com urgência!`,
        priority: 'max',
        sound: "notification.mp3",
        categoryIdentifier: "okButton",
        vibrate: [0, 250, 250, 250],
        data: {
          medId
        }
      },
      trigger: {
        channelId: 'inventory',
        hour: 9,
        minute: 30,
        repeats: true,
      },
    });
  }

  if (days <= 0) {
    Notifications.cancelScheduledNotificationAsync(`${medId}-inventory`)
    Notifications.dismissNotificationAsync(`${medId}-inventory`)
    cancelNotifications(medicine.name, medicine.hours)
    Notifications.scheduleNotificationAsync({
      identifier: `${medId}-inventory`,
      content: {
        autoDismiss: false,
        sticky: true,
        title: `Você não possui mais estoque de ${medicine.name}`,
        body: `Enquanto você não adicionar mais estoque, vamos parar de lhe enviar notificações para tomar este medicamento`,
        priority: 'max',
        sound: "notification.mp3",
        categoryIdentifier: "okButton",
        vibrate: [0, 250, 250, 250],
        data: {
          medId
        }
      },
      trigger: {
        channelId: 'inventory',
        hour: 9,
        minute: 30,
        repeats: true,
      },
    });
  }

}