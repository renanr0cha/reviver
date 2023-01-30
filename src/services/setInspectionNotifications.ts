import * as Notifications from 'expo-notifications';

export async function setInspectionNotifications(mode: "daily" | "weekly") {
  await Notifications.cancelScheduledNotificationAsync("inspection-reminder")
  await Notifications.scheduleNotificationAsync({
    identifier: "inspection-reminder",
    content: {
      autoDismiss: false,
      title: `Não esqueça de adicionar seus dados de saúde`,
      body: `Aperte aqui para adicionar um registro`,
      priority: 'max',
      sound: "default",
    },
    trigger: mode === "weekly" ? {
      channelId: 'inspection',
      weekday: 2,
      hour: 10,
      minute: 30,
      repeats: true,
    } : {
      channelId: 'inspection',
      hour: 10,
      minute: 30,
      repeats: true,
    },
  });
}
