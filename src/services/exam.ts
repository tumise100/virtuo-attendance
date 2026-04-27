import FetchClient, { HttpMethod } from "../config";

export async function GetExams() {
  return FetchClient({
    endpoint: `/exam`,
  });
}

export async function GetExamQuestions() {
  return FetchClient({
    endpoint: `/exam/question`,
  });
}

export async function CreateQuestion(data: any) {
  return FetchClient({
    endpoint: `/exam/question`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function DeleteQuestion(id: number) {
  return FetchClient({
    endpoint: `/exam/question/${id}`,
    method: HttpMethod.DELETE,
  });
}

export async function UpdateQuestion(id: number, data: any) {
  return FetchClient({
    endpoint: `/exam/question/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}
