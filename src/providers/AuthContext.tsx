import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useSetRefreshToken } from "../api/user/queries";
import { MutateOptions } from "react-query";
import { LoginRequest } from "../schema/login.schema";
import { message } from "antd";


interface AuthContextProps {
  loggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isExpired:() => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("bookRental")
  );

  const navigate = useNavigate();


  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);


  const {mutate: loginUser} = useLogin()

  const login:any = (username: LoginRequest,password: MutateOptions<any, unknown, LoginRequest, unknown> | undefined) => {
    loginUser({username,password}, {
      onSuccess:(data)=>{
        const {accessToken, refreshToken} = data;
       localStorage.setItem("bookRental", accessToken);
       localStorage.setItem("refreshToken", refreshToken);

        setLoggedIn(true);
        message.success(`Login Sucessfull`)
      }, 
      onError:(errorMsg)=> {
        message.error(`Login Failed ${errorMsg}`)
      },
    }) 
    
  }

  const refToken:any = localStorage.getItem('refreshToken')
  const {mutate:refreshAccessToken} = useSetRefreshToken()

  const isExpired = () => {
    refreshAccessToken(refToken, {
      onSuccess:(data)=> {
        const {accessToken} = data;
        localStorage.setItem('bookRental', accessToken)
        console.log( localStorage.getItem('bookRental'))
      }
    })
  }


  const logout = () => {
    localStorage.removeItem("bookRental");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
  
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
