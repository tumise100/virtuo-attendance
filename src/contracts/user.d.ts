import { ELevel, ICourseWithClasses } from "./course";

export enum AccountType {
  STUDENT = AccountType.STUDENT,
  ADMIN = "ADMIN",
  LECTURER = "LECTURER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  SCHOOL = "SCHOOL",
}

enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  BINARY = "BINARY",
}

interface AdminUser {
  accountType: AccountType.ADMIN;
  email: string;
  firstName: string;
  lastName: string;
}

interface COURSE {
  title: string;
  code: string;
  level: ELevel;
}

export interface IUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  firstName: string;
  lastName: string;
  email: string;
  isFirstLogin: false;
  lastLogin: string;
  isActivated: true;
  isTermsAccepted: false;
  // accounts: IAccount<AccountType.LECTURER>[];
  accounts: IAccount[];
}

interface IAccount {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  type: AccountType;
  identityCode: string;
  business_owner: null;
  admin: null;
  school?: ISchoolUser;
  lecturer?: ILecturerUser;
  student?: IStudentUser[];
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

  classTeacher: boolean;
  className: string;
  passport: string;

  lecturerType: string;
  facultyId: number;
  departmentId: number;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;

  department?: {
    name: string;
    slug: string;
    facultyId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
  };
}

interface IStudentUser {
  accountId: number;
  lastName: string;
  firstName: string;
  localGovernment: string;
  stateOfOrigin: string;
  sex: string;
  bio: string;
  phone: string;
  email: string;
  facultyId: number;
  departmentId: number;
  schoolId: number;
  level: ELevel;
  yearOfAdmission: number;
  matricNumber: string;
  dateOfBirth: string;
  guardianFullName: string;
  linkedinUrl: string;
  facebookUrl: string;
  xUrl: string;
  instagramUrl: string;
  passport: null;
  studentType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;

  class?: {
    name: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
  };

  department?: {
    createdAt: string;
    deletedAt: null;
    facultyId: number;
    id: number;
    name: string;
    slug: string;
    updatedAt: string;
  };

  faculty?: {
    createdAt: string;
    deletedAt: null;
    id: number;
    name: string;
    schoolAccountId: null;
    slug: string;
    updatedAt: string;
  };
}

interface ISchoolUser {
  accountId: number;
  address: string;
  bio: string;
  createdAt: string;
  deletedAt: null;
  email: string;
  logo: null;
  name: string;
  ownerFirstName: string;
  ownerLastName: string;
  phoneNumber: string;
  regCode: string;
  schoolType: string;
  state: string;
  status: boolean;
  updatedAt: string;
  yearOfEstablishment: number;
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
  student: IStudentUser;
}

export interface IStudentViewDetail {
  student: IStudentUser;
  courses: ICourseWithClasses[];
}
