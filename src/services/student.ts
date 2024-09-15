import FetchClient from "../config";

export async function GetAStudent({
  lecturerId,
  studentId,
}: {
  lecturerId: number;
  studentId: number;
}) {
  return FetchClient({
    endpoint: `/courses/lecturer/${lecturerId}/student/${studentId}/details`,
  });
}
