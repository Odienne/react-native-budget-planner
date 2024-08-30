import {KindeSDK} from '@kinde-oss/react-native-sdk-0-7x';

const KINDE_ISSUER_URL = "https://odienne.kinde.com"
const KINDE_POST_CALLBACK_URL = "exp://192.168.1.16:8081"
const KINDE_CLIENT_ID = "bee62862d23c4b4d8a360c873331bf88"
const KINDE_POST_LOGOUT_REDIRECT_URL = "exp://192.168.1.16:8081"

export const client = new KindeSDK(KINDE_ISSUER_URL, KINDE_POST_CALLBACK_URL, KINDE_CLIENT_ID, KINDE_POST_LOGOUT_REDIRECT_URL);
