import FetchClient, { HttpMethod } from "../config";

export async function GetSchoolSettings() {
  return FetchClient({
    endpoint: "/school/settings",
  });
}

export async function UpdateSchoolSettings(data: any) {
  return FetchClient({
    endpoint: "/school/settings",
    method: HttpMethod.PUT,
    body: data,
  });
}

export async function GetStaffProfile(staffId: number | string) {
  return FetchClient({
    endpoint: `/staff/${staffId}`,
  });
}

export async function UpdateStaffProfile(staffId: number | string, data: any) {
  return FetchClient({
    endpoint: `/staff/${staffId}/update`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function ChangeStaffPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  return FetchClient({
    endpoint: `/staff/change-password`,
    method: HttpMethod.POST,
    body: input,
  });
}
