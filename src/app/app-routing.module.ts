import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectionComponent } from './components/section/section.component';
import { ClassComponent } from './components/class/class.component';
import { ExamDateComponent } from './components/exam-date/exam-date.component';
import { ExamTermComponent } from './components/exam-term/exam-term.component';
import { PaperComponent } from './components/paper/paper.component';
import { StudentComponent } from './components/student/student.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { SubjectTeacherComponent } from './components/subject-teacher/subject-teacher.component';
import { SchoolComponent } from './components/school/school.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

const SECURE_ROUTES:Routes = [
  {path:'section',component:SectionComponent},
  {path:'class',component:ClassComponent},
  {path:'examdate',component:ExamDateComponent},
  {path:'examterm',component:ExamTermComponent},
  {path:'paper',component:PaperComponent},
  {path:'student',component:StudentComponent},
  {path:'subject',component:SubjectComponent},
  {path:'teacher',component:TeacherComponent},
  {path:'class/subject-teacher',component:SubjectTeacherComponent},
  {path:'school',component:SchoolComponent}
];

const routes: Routes =[
          {path:'login',component:LoginComponent},
          {path:'',component:MainComponent,
            children:SECURE_ROUTES
          }
            
        

/*           {path:'',component:MainComponent,children:SECURE_ROUTES,outlet:'main'}
 */        ];





@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
