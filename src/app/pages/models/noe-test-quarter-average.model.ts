// src/models/noe-test-quarter-average.model.ts (فایل جدید)

export interface Avrages {
    averageOne: number;
    averageTwo: number;
    averageThree: number;
    averageFour: number;
}

export interface AvrageNoeTestDto {
    idNoeTest: string; // Guid در C# به string در TS تبدیل می‌شود
    titleNoeTest: string;
    avrages: Avrages;
}

// اگر از ApiResponse در کل پروژه استفاده می‌کنید، آن را هم import کنید
export interface ApiResponse<T> {
    isSuccess: boolean;
    statusCode: number;
    message: string | null;
    data: T;
}