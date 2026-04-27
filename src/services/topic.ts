import FetchClient, { HttpMethod } from "../config";

export async function GetTopics(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/topic?${queryString}`,
  });
}

export async function CreateTopic(data: any) {
  return FetchClient({
    endpoint: `/topic`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateTopic(id: number, data: any) {
  return FetchClient({
    endpoint: `/topic/${id}`,
    method: HttpMethod.PATCH,
    body: data,
  });
}

export async function DeleteTopic(id: number) {
  return FetchClient({
    endpoint: `/topic/${id}`,
    method: HttpMethod.DELETE,
  });
}
