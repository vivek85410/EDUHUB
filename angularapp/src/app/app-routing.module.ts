import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ErrorComponent } from './components/error/error.component';
import { StudentviewcourseComponent } from './components/studentviewcourse/studentviewcourse.component';
import { MycourseComponent } from './components/mycourse/mycourse.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { EducatoraddcourseComponent } from './components/educatoraddcourse/educatoraddcourse.component';
import { EducatoreditcourseComponent } from './components/educatoreditcourse/educatoreditcourse.component';
import { EducatorviewcourseComponent } from './components/educatorviewcourse/educatorviewcourse.component';
import { EnrollmentlistComponent } from './components/enrollmentlist/enrollmentlist.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { EducatormaterialsComponent } from './components/educatormaterials/educatormaterials.component';
import { StudentcourseDetailComponent } from './components/studentcourse-detail/studentcourse-detail.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MockPaymentComponent } from './components/mock-payment/mock-payment.component';
import { AuthGuard } from './components/authguard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'courses',
    component: StudentviewcourseComponent
  },
  {
    path: 'mycourses',
    component: MycourseComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  {
    path: 'course-detail/:courseId',
    component: StudentcourseDetailComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  {
    path: 'addfeedback',
    component: UseraddfeedbackComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  {
    path: 'myfeedback',
    component: UserviewfeedbackComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  {
    path: 'educator/addcourse',
    component: EducatoraddcourseComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'educator/editcourse/:courseId',
    component: EducatoreditcourseComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'educator/courses',
    component: EducatorviewcourseComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'educator/materials',
    component: EducatormaterialsComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'enrollments',
    component: EnrollmentlistComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'admin/feedback',
    component: AdminviewfeedbackComponent,
    canActivate: [AuthGuard],
    data: { role: 'Educator' }
  },
  {
    path: 'about',
    component: AboutusComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mock-payment',
    component: MockPaymentComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}