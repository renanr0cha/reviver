import * as Notifications from "expo-notifications";

export async function setUpCategoryForNotificationResponse() {
  Notifications.setNotificationCategoryAsync("buttons", [
    {
      identifier: "yes",
      buttonTitle: "Já tomei"
    },
    {
      identifier: "no",
      buttonTitle: "Ver detalhes"
    },
  ])
}

