import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {NgSelectModule} from '@ng-select/ng-select';
import { OwlDateTimeModule,OwlNativeDateTimeModule,DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { ClassComponent } from './components/class/class.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { ExamTermComponent } from './components/exam-term/exam-term.component';
import { ExamDateComponent } from './components/exam-date/exam-date.component';
import { PaperComponent } from './components/paper/paper.component';
import { SectionComponent } from './components/section/section.component';
import { SearchPipe } from './pipes/search.pipe';
import { OpenmenuDirective } from './directives/openmenu.directive';
import { SubjectTeacherComponent } from './components/subject-teacher/subject-teacher.component';
import { SchoolComponent } from './components/school/school.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { SharedService } from './services/shared.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { MainComponent } from './components/main/main.component';


export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD-MM-YYYY HH:mm:ss',
  parseInput: 'DD-MM-YYYY HH:mm:ss',
  datePickerInput: 'DD-MM-YYYY HH:mm:ss',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    MobileMenuComponent,
    ClassComponent,
    SubjectComponent,
    TeacherComponent,
    StudentComponent,
    ExamTermComponent,
    ExamDateComponent,
    PaperComponent,
    SectionComponent,
    SearchPipe,
    OpenmenuDirective,
    SubjectTeacherComponent,
    SchoolComponent,
    TopBarComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule
  ],
  providers: [
      SharedService,
      {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
      {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN'}
    ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
 