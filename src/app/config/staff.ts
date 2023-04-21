export interface Staff {
    id: string,
    firstName: string;
    lastName: string;
    number: number;
    dateOfBirth: Date;
    genfer: string;
    address: string;
    emergencyContactName: string;
    emergencyContactNumber: number;
    performedServices: string[];
    role: string;
    monthlySales: string;
    commission: string;
    reviews: string;
    performance: string;
    email: string;
    password: string;
}

export interface StaffService {
    id: number;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    serviceDuration: number;
    categoryId: number;
    categoryName: string;
}

export interface AddNewStaff {
    email?: string; //  must be valid email format
    password?: string; // required, value must be equal to confirm password.
    confirmPassword?: string; // required, value must be equal to password.
    number?: number; // required, value must be equal to password.
    username?: string;
    newServices?: string[];
    selectedServices?: string[];
    services?: string[];
    id?: string;
}