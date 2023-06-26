import { PUSHER_APP_KEY } from "@/app/constants/PusherAppKey";
import Pusher from "pusher-js";

const PusherClient = new Pusher(PUSHER_APP_KEY, {
  cluster: "us2",
});

export default PusherClient;
