export interface Employees {
    text: string;
    id: number;
    color: string;
    workdays: number[];
    startHour: string;
    endHour: string;
}

export interface Bookings {
    id: number;
    subject: string;
    startTime: string;
    endTime: string;
    isAllDay: string;
    clientId: number
}