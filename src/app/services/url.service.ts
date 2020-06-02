import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

   IP:string = "http://localhost:8081";
   AUTHENTICATE=this.IP+"/authenticate"
   CLASSES=this.IP+"/class/";
   CLASS_DELETE=this.CLASSES+"delete/";
   CLASSES_PAGED=this.CLASSES+"page/"
   SECTIONS=this.IP+"/section/"
   SECTION_DELETE=this.SECTIONS+"delete/"
   SUBJECTS=this.IP+"/subjects/"
   SUBJECT_DELETE=this.SUBJECTS+"delete/";
   STUDENTS=this.IP+"/student/"
   STUDENT_DELETE=this.STUDENTS+"delete/"
   TEACHERS=this.IP+"/teacher/"
   TEACHER_DELETE=this.TEACHERS+"delete/"
   EXAMTERMS=this.IP+"/examterm/"
   EXAMTERM_DELETE=this.EXAMTERMS+"delete/"
   SCHOOLS=this.IP+"/school/"
   SCHOOL_DELETE=this.SCHOOLS+"delete/";
   CST=this.IP+"/cst/"
   CST_DELETE=this.CST+"delete/"
   PAPER=this.IP+"/paper/"
   PAPER_DELETE=this.PAPER+"delete/"
   QUESTION_DELETE=this.PAPER+"delete/question/"
   QUESTIONS_OF_PAPER=this.PAPER+"questions/"
   EXAMDATE =this.IP+"/examdate/"
   EXAMDATE_DELETE=this.EXAMDATE+"delete/"
   
}
