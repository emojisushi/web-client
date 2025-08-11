import Cookies from "js-cookie";
import { configureAuth } from "react-query-auth";
import { AUTHENTICATED_USER_QUERY_KEY } from "~common/constants";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth({
    userKey: AUTHENTICATED_USER_QUERY_KEY,
    userFn: () =>
      EmojisushiAgent.fetchUser()
        .then((res) => res.data)
        .catch((e) => {
          // // 406 simply means that user is not authorzied, no need to throw error in this case
          if (![406].includes(e?.response.status)) {
            throw e;
          }
          return null;
        }),
    loginFn: async ({ email, password }) => {
      const res = await EmojisushiAgent.login({
        email,
        password,
      });
      const { token } = res.data.data;
      Cookies.set("jwt", token);
      return res.data.data.user;
    },
    registerFn: async ({
      email,
      password,
      password_confirmation,
      name,
      surname,
      agree,
    }) => {
      const res = await EmojisushiAgent.register({
        email,
        password,
        password_confirmation,
        name,
        surname,
        agree,
        auto_login: true,
        activate: true,
      });
      const { token } = res.data.data;
      Cookies.set("jwt", token);
      return res.data.data.user;
    },
    logoutFn: async () => {
      Cookies.remove("jwt");

      return true;
    },
  });
