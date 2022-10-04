import * as Notifications from "expo-notifications";

export async function setUpCategoryForNotificationReponse() {
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

