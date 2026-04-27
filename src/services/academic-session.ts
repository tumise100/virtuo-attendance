import FetchClient, { HttpMethod } from "../config";

export async function GetSessions() {
  return FetchClient({
    endpoint: `/academic-session`,
  });
}

export async function GetTerms(sessionId: number) {
  return FetchClient({
    endpoint: `/academic-session/terms?sessionId=${sessionId}`,
  });
}

export async function CreateSession(data: any) {
  return FetchClient({
    endpoint: `/academic-session`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function CreateTerm(data: any) {
  return FetchClient({
    endpoint: `/academic-session/term`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function SetCurrentTerm(id: number) {
  return FetchClient({
    endpoint: `/academic-session/term/${id}/current`,
    method: HttpMethod.PUT,
  });
}

export async function GetCurrentSession() {
  return FetchClient({
    endpoint: `/academic-session/current`,
  });
}
