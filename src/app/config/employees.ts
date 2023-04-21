export interface Employees {
    text: string;
    id: number;
    color: string;
    workdays: number[];
    startHour: string;
    endHour: string;
}

export interface Bookings {
    clientId?: number;
    description?: string;
    endTime?: string;
    eventType?: string;
    id?: number;
    isAllDay?: string;
    customer?: String;
    startTime?: string;
    service?: string;
    employeeId?: number;
    serviceId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

export interface Client {
    name: string,
    phoneNumber: string,
    satisfactionLevel: string,
    emailAddress: string,
    lastVisit: string,
    dateOfBirth: string,
    activeStatus: string,
    clientImage: string,
    address: string
}