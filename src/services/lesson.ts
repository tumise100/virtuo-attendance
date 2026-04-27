import FetchClient, { HttpMethod } from "../config";

export async function GetLessons(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/lesson?${queryString}`,
  });
}

export async function GetLessonDetail(id: number) {
  return FetchClient({
    endpoint: `/lesson/${id}`,
  });
}

export async function CreateLesson(data: any) {
  return FetchClient({
    endpoint: `/lesson`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateLesson(id: number, data: any) {
  return FetchClient({
    endpoint: `/lesson/${id}`,
    method: HttpMethod.PATCH,
    body: data,
  });
}

export async function DeleteLesson(id: number) {
  return FetchClient({
    endpoint: `/lesson/${id}`,
    method: HttpMethod.DELETE,
  });
}
