import { Course } from './course.model';
import { User } from './user.model';

export interface Enrollment {
  enrollmentId?: number;
  userId: number;
  user?: User;
  courseId: number;
  course?: Course;
  enrollmentDate?: string;
  status?: string;
}