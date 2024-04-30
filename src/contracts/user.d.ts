enum AccountType {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  LECTURER = "LECTURER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
}

enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  BINARY = "BINARY",
}

enum Level {
  100 = "HUNDRED",
  200 = "TWOHUNDRED",
  300 = "THREEHUNDRED",
  400 = "FOURHUNDRED",
  500 = "FIVEHUNDRED",
}

interface StudentUser {
  accountType: AccountType.STUDENT;
  email: string;
  firstName: string;
  lastName: string;
  localGovernment: string;
  stateOfOrigin: string;
  phone: string;
  sex: Sex;
  level: Level;
  facultyId: string;
  departmentId: string;
  matricNumber: string;
  yearOfAdmission: string;
  xUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
}

interface AdminUser {
  accountType: AccountType.ADMIN;
  email: string;
  firstName: string;
  lastName: string;
}

interface LecturerUser {
  accountType: AccountType.LECTURER;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
}

interface COURSE {
  title: string;
  code: string;
  level: Level;
}
