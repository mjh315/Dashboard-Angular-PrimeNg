// src/app/models/recent-test.model.ts

export interface RecentTest {
    testId: string;
    titleItemArzyabi: string; // نام تست
    itemArzyabiId: string;
    titleNoeTest: string; // نوع تست
    noeTestId: string;
    titleShift: string; // شیفت
    shiftId: string;
    titleFireFighter: string; // نام آتش‌نشان
    fireFighterId: string;
    titleArzyab: string; // نام ارزیاب
    arzyabId: string;
    nomreh: number; // نمره
    date: string | null;
}

export interface RecentTestsResponse {
    code: number;
    message: string;
    isSuccess: boolean;
    data: {
        items: RecentTest[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
}