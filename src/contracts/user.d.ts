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

interface ILecturerUser {
  accountId: number;
  lastName: string;
  firstName: string;
  position: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  localGovernment: string;
  sex: string;
  bio: null;
  phone: string;
  email: string;
  lecturerType: string;
  facultyId: number;
  departmentId: number;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface COURSE {
  title: string;
  code: string;
  level: Level;
}

interface IAccount<T> {
  id: number;
  // type: AccountType;
  type: T;
  admin: any;
  business_owner: any;
  createdAt: string;
  deletedAt: any;
  identityCode: string;
  lecturer: ILecturerUser[];
  school?: any;
  student?: any;
  updatedAt: string;
}
// interface Account {
//   admin: any;
//   createdAt: string;
//   id: number;
//   type: AccountType;
//   updatedAt: string;
// }
export interface ILecturer {
  accounts: IAccount<AccountType.LECTURER>[];
  // accounts: Account[];
  createdAt: string;
  deletedAt: any;
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
      lastLogin: any;
      deletedAt: any;
      hashedRt: any;
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
