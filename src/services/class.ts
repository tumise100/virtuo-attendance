import FetchClient, { HttpMethod } from "../config";

// export async function CreateNewClass(input: {
//   courseId: number;
//   day: string;
//   startTime: string;
//   endTime: string;
// }) {
//   return FetchClient({
//     endpoint: `/courses/create-class`,
//     // body: JSON.stringify(input),
//     body: input,
//     method: HttpMethod.POST,
//   });
// }

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

export async function DeleteClass({ classId }: { classId: number }) {
  return FetchClient({
    endpoint: `/courses/remove/${classId}`,
    method: HttpMethod.DELETE,
  });
}

export async function GetClassesOfSecondarySchool({
  schoolId,
}: {
  schoolId: number;
}) {
  return FetchClient({
    endpoint: `/school/all-school-class/${schoolId}`,
  });
}

export async function GetClassDetailOfSecondarySchool({
  schoolId,
  classId,
}: {
  schoolId: number;
  classId: number;
}) {
  return FetchClient({
    endpoint: `/students-attendance/class-attendance/${classId}/${schoolId}`,
  });
}
