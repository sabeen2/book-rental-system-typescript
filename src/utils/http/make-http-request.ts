import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { BASE_API_ENDPOINT } from "../../config/api.config";
import {
  IApiDetails,
  IApiRequestDetails,
  RequestAuthType,
} from "../../schema/http.schema";
import { sanitizeController } from "./sanitize-controller";

const getToken = () => {
  return localStorage.getItem("bookRental");
};

const token = getToken();

export const makeHttpRequest = async (
  apiDetails: IApiDetails,
  apiRequestDetails: IApiRequestDetails = {}
) => {
  const sanitizedRequestDetails = sanitizeController(
    apiDetails,
    apiRequestDetails.pathVariables
  );
  const { controllerName, requestMethod } = sanitizedRequestDetails;

  let headers: any = {
    "Content-Type": "application/json",
  };

  if (apiDetails.requestAuthType === RequestAuthType.AUTH) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let config: AxiosRequestConfig = {
    baseURL: BASE_API_ENDPOINT,
    url: `/${controllerName}`,
    method: requestMethod,
    responseType: "json",
    headers,
    data: apiRequestDetails.requestData,
  };

  if (apiRequestDetails.params) {
    config = {
      ...config,
      params: apiRequestDetails.params,
    };
  }

  try {
    const res = await axios.request(config);
    return res.data.data;
  } catch (error) {
    let errorMsg = "";
    

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401 ) {
        try {

          const refreshTokens = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(
            `${BASE_API_ENDPOINT}/admin/user/refreshToken`,
            {
              token: refreshTokens,
            }
          );
          const { accessToken, refreshToken } = refreshResponse.data.data;
          localStorage.setItem("bookRental", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          
        } catch (refreshError) {
          console.log("Failed to refresh token:", refreshError);
          throw new Error("Failed to refresh token");
        }
    } else {
      errorMsg = (axiosError.response?.data as any)?.data?.errorMessage || axiosError.message;
    }
  } else {
    errorMsg = "Something went wrong";
  }

  throw new Error(errorMsg);
    }
  }
;
