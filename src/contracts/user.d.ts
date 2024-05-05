enum AccountType {
  STUDENT = AccountType.STUDENT,
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

interface Account {
  admin: any;
  createdAt: string;
  id: number;
  type: AccountType;
  updatedAt: string;
}
export interface ILecturer {
  account: { id: number; type: AccountType.LECTURER };
  accounts: Account[];
  createdAt: string;
  deletedAt: null;
  email: string;
  firstName: string;
  id: number;
  isActivated: true;
  isFirstLogin: false;
  isTermsAccepted: false;
  lastLogin: string;
  lastName: string;
  updatedAt: string;
}

export interface IStudent {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: AccountType.STUDENT;
  users: [
    {
      id: number;
      createdAt: string;
      updatedAt: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      isFirstLogin: false;
      lastLogin: null;
      deletedAt: null;
      hashedRt: null;
      isActivated: true;
      isTermsAccepted: false;
    }
  ];
  student: {
    accountId: number;
    lastName: string;
    firstName: string;
    localGovernment: string;
    stateOfOrigin: string;
    sex: Sex;
    phone: string;
    email: string;
    facultyId: number;
    departmentId: number;
    schoolId: number;
    level: Level;
    yearOfAdmission: number;
    matricNumber: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
  };
}
