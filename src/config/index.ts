import { combineStore as Store } from "@/src/store/index";
import { showToast } from "../components/UI/showToast";

// export const API_URL = "http://161.97.118.183:2024";
// export const _API_URL = "https://api.virtuobusiness.com";
// export const API_URL = "https://staging.virtuobusiness.com";
// export const API_URL = "https://staging.virtuobusiness.com";
export const API_URL = "https://api.virtuobusiness.com";
export const _api_key = "YOUR_API_KEY";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
}

export default async function FetchClient({
  endpoint,
  method,
  body,
  headers,
}: {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}) {
  const { token, updateUserToken } = Store.getState();

  const config = {
    method: method ? method : HttpMethod.GET,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
    body: JSON.stringify(body),
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);

    let data = await response.json();
    let responseStatus = response.status;

    if (data?.message === "Unauthorized") {
      updateUserToken("");
    }

    return { responseData: data, responseStatus };
  } catch (error) {
    // @ts-ignore
    if (error && error.message) {
      // @ts-ignore
      showToast(error.message);
    }
    throw error;
  }
}

// contact.sunnyschool@example.com
// james.doe@example.com
// samuel.williams@example.com
// p: password
