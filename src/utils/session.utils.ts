import Cookies from "js-cookie";
import { generateHash } from "~utils/hash.utils";

export const getSession = () => {
  return Cookies.get("session_id");
};

export const createSession = () => {
  return Cookies.set("session_id", generateHash(100));
};

export const removeSession = () => {
  return Cookies.remove("session_id");
};
