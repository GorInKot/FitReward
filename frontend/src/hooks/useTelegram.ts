import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export function useTelegram() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.MainButton.setText("Начать тренировку");
  }, []);
}
