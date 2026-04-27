import { combineStore as Store } from "@/src/store/index";
import { showToast } from "../components/UI/showToast";

// export const API_URL = "http://161.97.118.183:2024";
// export const _API_URL = "https://api.virtuobusiness.com";
// export const API_URL = "https://staging.virtuobusiness.com";
// export const API_URL = "https://staging.virtuobusiness.com";

export const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.virtuobusiness.online";
export const _api_key = process.env.EXPO_PUBLIC_API_KEY || "YOUR_API_KEY";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export default async function FetchClient({
  endpoint,
  method,
  body,
  headers,
  isMultipart,
}: {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  isMultipart?: boolean;
}) {
  const { token, updateUserToken, activeBranchId } = Store.getState();

  const isFormData = body instanceof FormData || isMultipart;

  const config: any = {
    method: method ? method : HttpMethod.GET,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      "x-branch-id": activeBranchId ? String(activeBranchId) : "",
      ...headers,
    },
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);
    let responseStatus = response.status;
    const rawText = await response.text();
    let data: any = {};
    if (rawText && rawText.trim().length > 0) {
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn(`[FetchClient] Non-JSON response from ${endpoint}:`, rawText.slice(0, 200));
        data = { message: rawText };
      }
    }

    // Mock Response for UI Mode (DISABLED)
    // console.log(`[MOCK FETCH] ${method || 'GET'} ${endpoint}`);
    // let data: any = { status: "success", data: [] };
    // let responseStatus = 200;

    // // Add specific mock data if needed for certain endpoints
    // if (endpoint.includes("/students")) data = { status: "success", data: [] }; // Mock empty students

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
