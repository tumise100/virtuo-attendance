import FetchClient, { HttpMethod } from "../config";

export async function Login(input: { email: string; password: string }) {
  return FetchClient({
    endpoint: "/auth/login",
    body: input,
    method: HttpMethod.POST,
  });
}

export async function ChangePassword(input: {
  oldPassword: string;
  newPassword: string;
}) {
  return FetchClient({
    endpoint: "/auth/me/change-password",
    body: input,
    method: HttpMethod.PATCH,
  });
}

export async function GetMe() {
  return FetchClient({
    endpoint: "/auth/me",
  });
}

export async function GetAllStudents() {
  return FetchClient({
    endpoint: `/accounts?type=STUDENT`,
  });
}
