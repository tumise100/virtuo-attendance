// import FetchClient, { API_URL, HttpMethod } from "../config";

// export async function Login(input: { email: string; password: string }) {
//   return FetchClient({
//     endpoint: "/auth/login",
//     body: input,
//     method: HttpMethod.POST,
//   });
// }
// // export async function Login(input: { email: string; password: string }) {
// //   try {
// //     let response = await fetch(`${API_URL}/auth/login`, {
// //       method: "POST",
// //       body: JSON.stringify(input),
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });

// //     let data = await response.json();
// //     let responseStatus = response.status;

// //     return { responseData: data, responseStatus };
// //   } catch (error) {
// //     throw error;
// //   }
// // }

// export async function GetMe() {
//   try {
//     let response = await fetch(`${API_URL}/auth/me`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     let data = await response.json();
//     let responseStatus = response.status;

//     return { responseData: data, responseStatus };
//   } catch (error) {
//     throw error;
//   }
// }

// export async function GetMyCourses() {
//   try {
//     let response = await fetch(`${API_URL}/courses/lecturer/14`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     let data = await response.json();
//     let responseStatus = response.status;

//     return { responseData: data, responseStatus };
//   } catch (error) {
//     throw error;
//   }
// }

// export async function MarkAttendance(input: {
//   classId: number;
//   studentId: number;
// }) {
//   try {
//     let response = await fetch(`${API_URL}/courses/mark-attendance`, {
//       method: "POST",
//       body: JSON.stringify(input),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     let data = await response.json();
//     let responseStatus = response.status;

//     return { responseData: data, responseStatus };
//   } catch (error) {
//     throw error;
//   }
// }
