// src/models/noe-test-avrage.model.ts

export interface ItemArzyabiAvrage {
    temArzyabiId: string;
    temArzyabiName: string;
    avrage: number;
}

export interface GetNoeTestAvragesDto {
    noeTestId: string;
    noeTestName: string;
    avrage: number; // میانگین کلی این نوع تست
    itemArzyabiAvrage: ItemArzyabiAvrage[];
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    isSuccess: boolean;
    data: T; // در این مورد: data: GetNoeTestAvragesDto[]
}