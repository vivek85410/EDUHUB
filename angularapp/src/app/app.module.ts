import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './components/authguard/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { EducatoraddcourseComponent } from './components/educatoraddcourse/educatoraddcourse.component';
import { EducatoraddmeterialComponent } from './components/educatoraddmeterial/educatoraddmeterial.component';
import { EducatoreditcourseComponent } from './components/educatoreditcourse/educatoreditcourse.component';
import { EducatorviewcourseComponent } from './components/educatorviewcourse/educatorviewcourse.component';
import { EducatormaterialsComponent } from './components/educatormaterials/educatormaterials.component';
import { EnrollmentlistComponent } from './components/enrollmentlist/enrollmentlist.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MycourseComponent } from './components/mycourse/mycourse.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { StudentcourseDetailComponent } from './components/studentcourse-detail/studentcourse-detail.component';
import { StudentviewcourseComponent } from './components/studentviewcourse/studentviewcourse.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MockPaymentComponent } from './components/mock-payment/mock-payment.component';
import { HeroSceneComponent } from './components/hero-scene/hero-scene.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminnavComponent,
    AdminviewfeedbackComponent,
    EducatoraddcourseComponent,
    EducatoraddmeterialComponent,
    EducatoreditcourseComponent,
    EducatorviewcourseComponent,
    EducatormaterialsComponent,
    EnrollmentlistComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    MycourseComponent,
    NavbarComponent,
    RegistrationComponent,
    StudentcourseDetailComponent,
    StudentviewcourseComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserviewfeedbackComponent,
    ToastContainerComponent,
    ConfirmModalComponent,
    AboutusComponent,
    ProfileComponent,
    MockPaymentComponent,
    HeroSceneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}