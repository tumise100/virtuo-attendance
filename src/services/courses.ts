import FetchClient, { HttpMethod } from "../config";

export async function GetLecturerClasses({
  lecturerId,
}: {
  lecturerId: number;
}) {
  return FetchClient({
    endpoint: `/courses/classes/lecturer/${lecturerId}/all`,
  });
}

export async function GetMyCourses(id: number) {
  return FetchClient({
    endpoint: `/courses/lecturer/${id}`,
  });
}

export async function GetACourse(id: string) {
  return FetchClient({
    endpoint: `/courses/${id}`,
  });
}

export async function GetAClass(id: number) {
  return FetchClient({
    endpoint: `/courses/oneclass/${id}`,
  });
}

export async function CreateNewClass(input: {
  courseId: number;
  day: string;
  startTime: string;
  endTime: string;
}) {
  return FetchClient({
    endpoint: `/courses/create-class`,
    method: HttpMethod.POST,
    body: input,
  });
}

export async function MarkAttendance(input: {
  classId: number;
  studentId: number;
}) {
  return FetchClient({
    endpoint: `/courses/mark-attendance`,
    method: HttpMethod.POST,
    body: input,
  });
}
