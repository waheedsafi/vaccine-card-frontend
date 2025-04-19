import React, { createContext, useContext, useEffect, useReducer } from "react";
import axiosClient from "../lib/axois-client";
import { Epi, Finance, User } from "@/database/tables";
import {
  getConfiguration,
  removeToken,
  returnPermissionsMap,
  setToken,
} from "@/lib/utils";
import { StatusEnum } from "@/lib/constants";
// import secureLocalStorage from "react-secure-storage";
interface AuthState {
  authenticated: boolean;
  user: User | Epi | Finance;
  loading: boolean;
  loginUser: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  loginEpi: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  loginFinance: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logoutUser: () => Promise<void>;
  logoutEpi: () => Promise<void>;
  logoutFinance: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setEpi: (user: Epi) => Promise<void>;
  setFinance: (user: Finance) => Promise<void>;
}
type Action =
  | { type: "LOGIN"; payload: User | Epi | Finance }
  | { type: "EDIT"; payload: User | Epi | Finance }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };

type Dispatch = React.Dispatch<Action>;
const initUser: User | Epi | Finance = {
  id: "",
  full_name: "",
  username: "",
  email: "",
  status: {
    id: StatusEnum.blocked,
    name: "",
    created_at: "",
  },
  grant: false,
  profile: "",
  role: { role: 3, name: "epi_user" },
  job: "",
  contact: "",
  destination: "",
  permissions: new Map(),
  created_at: "",
  zone: "",
  province: "",
  gender: "",
};
const initialState: AuthState = {
  user: initUser,
  authenticated: false,
  loading: true,
  loginUser: () => Promise.resolve(),
  loginEpi: () => Promise.resolve(),
  loginFinance: () => Promise.resolve(),
  logoutUser: () => Promise.resolve(),
  logoutEpi: () => Promise.resolve(),
  logoutFinance: () => Promise.resolve(),
  setUser: () => Promise.resolve(),
  setEpi: () => Promise.resolve(),
  setFinance: () => Promise.resolve(),
};
const StateContext = createContext<AuthState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

function reducer(state: AuthState, action: Action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      removeToken();
      return {
        ...state,
        authenticated: false,
        user: initUser,
        loading: false,
      };
    case "EDIT":
      return {
        ...state,
        user: action.payload,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadUser = async () => {
    try {
      const configuration = getConfiguration();
      if (configuration?.token === null || configuration?.token === undefined) {
        dispatch({ type: "STOP_LOADING" });
        return;
      }
      const response = await axiosClient.get(`auth-${configuration?.type}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const user = response.data.user;
        if (user != null) {
          user.permissions = returnPermissionsMap(response.data?.permissions);
        }
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "LOGOUT" });
    }
  };
  useEffect(() => {
    loadUser();
  }, []);
  const loginUser = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-user", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "user",
          });
        }
        const user = response.data.user as User;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const loginEpi = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-epi", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "epiuser",
          });
        }
        const user = response.data.user as Epi;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const loginFinance = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-finance", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "financeuser",
          });
        }
        const user = response.data.user as User;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const setUser = async (user: User): Promise<any> => {
    try {
      if (user != null || user != undefined)
        dispatch({ type: "EDIT", payload: user });
    } catch (error: any) {
      console.log(error);
    }
  };
  const setEpi = async (epi: Epi): Promise<any> => {
    try {
      if (epi != null || epi != undefined)
        dispatch({ type: "EDIT", payload: epi });
    } catch (error: any) {
      console.log(error);
    }
  };
  const setFinance = async (finance: Finance): Promise<any> => {
    try {
      if (finance != null || finance != undefined)
        dispatch({ type: "EDIT", payload: finance });
    } catch (error: any) {
      console.log(error);
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await axiosClient.post("auth-logout");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };
  const logoutEpi = async (): Promise<void> => {
    try {
      await axiosClient.post("logout-epi");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };
  const logoutFinance = async (): Promise<void> => {
    try {
      await axiosClient.post("logout-finance");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };

  return (
    <StateContext.Provider
      value={{
        ...state,
        loginUser,
        loginEpi,
        loginFinance,
        logoutUser,
        logoutEpi,
        logoutFinance,
        setUser,
        setEpi,
        setFinance,
      }}
    >
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
// export const useAuthState = () => useContext(StateContext);
export const useUserAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const { user, setUser, authenticated, loading, loginUser, logoutUser } =
    context;
  if (!user.role.name.startsWith("debugger") || user.role.name == "debugger") {
    const currentUser = user as User;
    return {
      user: currentUser,
      setUser,
      authenticated,
      loading,
      loginUser,
      logoutUser,
    };
  } else {
    throw new Error("You are not allowed");
  }
};
export const useEpiAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const { user, setEpi, authenticated, loading, loginEpi, logoutEpi } = context;
  if (!user.role.name.startsWith("epi") || user.role.name.startsWith("epi")) {
    const currentUser = user as Epi;
    return {
      user: currentUser,
      setEpi,
      authenticated,
      loading,
      loginEpi,
      logoutEpi,
    };
  } else {
    throw new Error("You are not allowed");
  }
};
export const useFinanceAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const {
    user,
    setFinance,
    authenticated,
    loading,
    loginFinance,
    logoutFinance,
  } = context;
  if (
    !user.role.name.startsWith("finance") ||
    user.role.name.startsWith("finance")
  ) {
    const currentUser = user as Finance;
    return {
      user: currentUser,
      setFinance,
      authenticated,
      loading,
      loginFinance,
      logoutFinance,
    };
  } else {
    throw new Error("You are not allowed");
  }
};
export const useGeneralAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");
  return context;
};

export const useAuthDispatch: () => Dispatch = () =>
  useContext(DispatchContext);
