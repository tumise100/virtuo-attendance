import FetchClient, { HttpMethod } from "../config";

export async function GetClasses(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/class?${queryString}`,
  });
}

export async function GetClassDetail(id: number | string) {
  return FetchClient({
    endpoint: `/class/${id}`,
  });
}

export async function CreateNewClass(data: any) {
  return FetchClient({
    endpoint: `/class`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateClass(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/class/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}

export async function DeleteClass(id: number | string | { classId: number | string }) {
  const resolvedId =
    typeof id === "object" && id !== null ? id.classId : id;

  return FetchClient({
    endpoint: `/class/${resolvedId}`,
    method: HttpMethod.DELETE,
  });
}

export async function GetClassLevels() {
  return FetchClient({
    endpoint: `/class/all/levels`,
  });
}

export async function GetClassSections() {
  return FetchClient({
    endpoint: `/class/all/sections`,
  });
}

export async function GetClassSubjects(classId?: number | string) {
  const query = classId ? `?classId=${classId}` : "";
  return FetchClient({
    endpoint: `/class-subject${query}`,
  });
}

// Legacy support
export async function GetClassesOfSecondarySchool() {
  return GetClasses();
}

export async function GetClassDetailOfSecondarySchool({ classId }: { classId: number }) {
  return GetClassDetail(classId);
}
