import { PUSHER_APP_KEY } from "@/app/constants/PusherAppKey";
import Pusher from "pusher";

const PusherInstance = new Pusher({
  appId: "1625660",
  key: PUSHER_APP_KEY,
  // TODO: Move to an environment variable. Leaving this here for now to make
  // local development easier.
  secret: "ab6826aabddffbb382df",
  cluster: "us2",
  useTLS: true,
});

export default PusherInstance;
