export interface Course {
    courseId?: number;
    title: string;
    description: string;
    courseStartDate: string;
    courseEndDate: string;
    category: string;
    level: string;
    thumbnailUrl?: string;
    price?: number | null;
    educatorId?: number | null;
  }