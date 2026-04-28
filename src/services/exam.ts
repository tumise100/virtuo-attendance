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
  const question = data.question ?? JSON.stringify({
    text: data.questionText,
    options: (data.options || []).map((text: string, index: number) => ({ id: index + 1, text })),
    class: data.className || '',
    topic: data.topic || '',
  });
  const answer = data.answer ?? (
    typeof data.correctAnswer === 'string' && data.correctAnswer.startsWith('option')
      ? data.correctAnswer
      : `option${Math.max((data.options || []).findIndex((option: string) => option === data.correctAnswer), 0) + 1}`
  );

  return FetchClient({
    endpoint: `/exam/question`,
    method: HttpMethod.POST,
    body: {
      subjectId: data.subjectId,
      question,
      answer,
    },
  });
}

export async function GenerateQuestionsFromLesson(lessonId: number, count = 10) {
  return FetchClient({
    endpoint: `/ai/generate-questions-from-lesson`,
    method: HttpMethod.POST,
    body: { lessonId, count },
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
