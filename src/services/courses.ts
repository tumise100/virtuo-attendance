import FetchClient, { HttpMethod } from "../config";

export async function GetSubjects(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/subject?${queryString}`,
  });
}

export async function GetSubjectDetail(id: number | string) {
  return FetchClient({
    endpoint: `/subject/${id}`,
  });
}

export async function CreateSubject(data: any) {
  return FetchClient({
    endpoint: `/subject`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateSubject(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/subject/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}

export async function DeleteSubject(id: number | string) {
  return FetchClient({
    endpoint: `/subject/${id}`,
    method: HttpMethod.DELETE,
  });
}

// Legacy support mappings
export async function GetMyCourses(_lecturerId?: number) {
  return GetSubjects();
}

export async function GetACourse(id: string | number) {
  return GetSubjectDetail(id);
}

export async function GetLecturerClasses(_lecturerId?: number) {
  return GetSubjects();
}

export async function GetAClass(classId: number | string) {
  return FetchClient({
    endpoint: `/class/${classId}`,
  });
}

export async function GetCourseClasses(courseId: number | string) {
  return FetchClient({
    endpoint: `/class?subjectId=${courseId}`,
  });
}

export async function MarkAttendance(data: {
  studentId?: number;
  staffId?: number;
  classId?: number;
  status?: string;
  sessionType?: string;
}) {
  if (data.staffId) {
    return FetchClient({
      endpoint: `/attendance/staff/mark`,
      method: HttpMethod.POST,
      body: data,
    });
  }

  return FetchClient({
    endpoint: `/attendance/student/mark`,
    method: HttpMethod.POST,
    body: data,
  });
}
