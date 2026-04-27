import FetchClient, { HttpMethod } from "../config";

export async function GetStudentTransactions(studentId: number | string) {
  return FetchClient({
    endpoint: `/finance/payments/student/${studentId}`,
  });
}

export async function GetStudentFees(studentId: number | string, termId?: number | string) {
  const query = termId ? `?termId=${termId}` : "";
  return FetchClient({
    endpoint: `/finance/fees/student/${studentId}${query}`,
  });
}

export async function RecordPayment(data: {
  studentId: number;
  feeId: number;
  amount: number;
  paymentMethod: string;
  reference?: string;
  description?: string;
}) {
  return FetchClient({
    endpoint: `/finance/record-payment`,
    method: HttpMethod.POST,
    body: data,
  });
}
