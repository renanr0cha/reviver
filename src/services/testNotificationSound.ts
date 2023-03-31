// import * as Notifications from 'expo-notifications';

// export async function testNotificationSound() {
//   await Notifications.deleteNotificationChannelAsync("emails")
//   await Notifications.setNotificationChannelAsync('emails', {
//     name: 'E-notifications',
//     importance: Notifications.AndroidImportance.MAX,
//     enableVibrate: true,
//     vibrationPattern: [255, 255, 255, 0],
//     sound: 'alarmsound.wav', // <- for Android 8.0+, see channelId property below
//   });
  
//   // Eg. schedule the notification
//   await Notifications.cancelScheduledNotificationAsync("test")

//   await Notifications.scheduleNotificationAsync({
//     identifier: "test",
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Open the notification to read them all',
//       subtitle: "This is a subtitle",
//       vibrate: [255, 255, 255, 0],
//       sound: 'alarmsound.wav', // <- for Android below 8.0
//     },
//     trigger: {
//       seconds: 10,
//       channelId: 'emails', // <- for Android 8.0+, see definition above
//     },
//   });
// }