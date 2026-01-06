export interface ItemOfActivities {
  type: string;
  message: string;
}

export interface ActivitiesOfTheLastMonthDto {
  today: ItemOfActivities[];
  lastDay: ItemOfActivities[];
  lastWeek: ItemOfActivities[];
  lastMonth: ItemOfActivities[];
}

// ساختار کلی پاسخ API شما
export interface ApiResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
}