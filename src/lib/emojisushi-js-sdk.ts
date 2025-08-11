import { createEmojisushiAgent } from "@layerok/emojisushi-js-sdk";
import { appConfig } from "~config/app";
import Cookies from "js-cookie";
import i18n from "~lib/react-i18next";
import { getFromLocalStorage } from "~utils/ls.utils";

export const EmojisushiAgent = createEmojisushiAgent({
  service: process.env.REACT_APP_API_BASE_URL,
});

type IParams = {
  XDEBUG_SESSION_START?: boolean;
  lang?: string;
  session_id?: string;
};

EmojisushiAgent.axiosClient.interceptors.request.use((config) => {
  // send session_id from cookies as parameter for each api request
  const { method } = config;

  const params: IParams = {};

  let session_id = Cookies.get("session_id");

  if (session_id) {
    config.headers["X-Session-ID"] = session_id;
  }

  if (appConfig.version) {
    config.headers["X-WEB-CLIENT-VERSION"] = appConfig.version;
  }

  const debugMode = localStorage.getItem("__debug_mode");

  if (debugMode) {
    // todo: indicate that debug mode is on in the interface
    config.headers["X-DEBUG-MODE"] = true;
  }

  if (process.env.REACT_APP_XDEBUG_SESSION_START === "true") {
    params.XDEBUG_SESSION_START = true;
  }

  params.lang =
    i18n.resolvedLanguage ||
    i18n.options.lng ||
    getFromLocalStorage({
      name: "i18nextLang",
      version: "1",
    }) ||
    "uk";

  if (method === "post") {
    config.data = {
      ...params,
      ...(config.data || {}),
    };
  } else {
    config.params = {
      ...params,
      ...(config.params || {}),
    };
  }

  const jwt = Cookies.get("jwt");

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

// todo: logout user if his token is expired

// client.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
// }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if([406].includes(error?.response?.status)) {
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
// });

// const refreshAuthLogic = (failedRequest) => {
//   const jwt = Cookies.get("jwt");
//   if (!jwt) {
//     return Promise.resolve();
//   }
//   return client.post("auth/refresh").then((tokenRefreshResponse) => {
//     Cookies.set("jwt", tokenRefreshResponse.data.token);
//     failedRequest.response.config.headers["Authorization"] =
//       "Bearer " + tokenRefreshResponse.data.token;
//     return Promise.resolve();
//   });
// };

// createAuthRefreshInterceptor(client, refreshAuthLogic, {
//   statusCodes: [401, 406],
// });
