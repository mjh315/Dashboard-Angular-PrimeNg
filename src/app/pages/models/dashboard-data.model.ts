// فرض کنید در فایلی مانند src/models/dashboard-data.model.ts قرار می‌گیرد

export interface FireFighterData {
    id: string;
    name: string;
    shiftId: string;
    shiftName: string;
    avrage: number;
}

export interface ShiftAvrage {
    id: string;
    shiftName: string;
    avrage: number;
    numberOfFireFighter: number;
}

export interface AgeRangeData {
    numberOfFireFighters: number;
    ageRange: string;
}

export interface FireFighterDetail {
    fireFighterId: string;
    name: string;
    date_Tavalod: string; // احتمالاً شمسی یا میلادی
    date_Create: string;  // احتمالاً شمسی یا میلادی
}

export interface NumberOfFireFightersData {
    numberOfFireFighters: number;
    numberOfLastJoined: number;
    fireFighters: FireFighterDetail[];
}

// ساختار داده اصلی که توسط API برگردانده می‌شود
export interface DashboardWidgetsData {
    bestFireFighters: FireFighterData[]; // برای AutoRotatingCard
    shiftsAvrages: ShiftAvrage[];       // برای ShiftsWidget
    allFireFightersAgeRanges: AgeRangeData[]; // برای AgeRangesWidget
    numberOfFireFighters: NumberOfFireFightersData[]; // برای NewFirefightersCard (که فقط یک عنصر دارد)
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    isSuccess: boolean;
    data: T;
}