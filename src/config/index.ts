import { combineStore as Store } from "@/src/store/index";

export const API_URL = "http://161.97.118.183:2024";
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
  const { token } = Store.getState();

  console.log(token, "Token");

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

    console.log(token, "in here!");

    return { responseData: data, responseStatus };
  } catch (error) {
    throw error;
  }
}
