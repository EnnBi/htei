import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Class } from '../class/class.component';
import { Subject } from '../subject/subject.component';
import { Section } from '../section/section.component';
import { ExamTerm } from '../exam-term/exam-term.component';
import { SubjectService } from 'src/app/services/subject.service';
import { ClassService } from 'src/app/services/class.service';
import { ExamTermService } from 'src/app/services/exam-term.service';
import { SectionService } from 'src/app/services/section.service';
import { PaperService } from 'src/app/services/paper.service';
import { SharedService } from 'src/app/services/shared.service';
import { NgForm, NgModelGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export class Question{
  id:number;
  question:string;
  optionA:string;
  optionB:string;
  optionC:string;
  optionD:string;
  correctAnswer:string;
}

export class Paper{
  id:number;
  subject:Subject;
  claass:Class;
  section:Section;
  term:ExamTerm;
  questions:Question[];
}

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit,OnDestroy{

  @ViewChild('myForm') myForm:NgForm;
  @ViewChild('modelGroup') qstnModelGroup:NgModelGroup;
  @ViewChild('class') cls:ElementRef;


  class:Class;
  section:Section;
  term:ExamTerm;
  subject:Subject;
  paper:Paper;
  question:Question;
  classes:Class[];
  sections:Section[];
  terms:ExamTerm[];
  subjects:Subject[];
  questions:Question[];
  papers:Paper[];

  questionIndex:number;
  edit:boolean=false;
  successToast:boolean=false;
  errorToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string=''; 
  searchTxt:string='';
  checkPaperModalShow=false;

  subscription:any;

  constructor(private subjectService:SubjectService,private examTermService:ExamTermService,
    private classService:ClassService,private sectionService:SectionService,
    private paperService:PaperService,private sharedService:SharedService) { }

  ngOnInit(): void {
   this.subscription = this.sharedService.school.subscribe((data:any)=>{
      this.initData();
    });

  }

  initData(){
    this.paper={id:0,claass:{id:0,name:''},subject:new Subject(),questions:[],section:new Section,term:new ExamTerm()};
    this.showLoadingToast('Loading')
    this.classService.fetchAll().subscribe((data:any)=>{
          this.classes=data;
          this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.examTermService.fetchAll().subscribe((data:any)=>{
        this.terms=data;
        this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.paperService.fetchAll().subscribe((data:any)=>{
        this.papers = data;
        this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.resetQuestionForm();
  }

  onClassChange(claass){
      this.subjects=[]
      this.sections=[]
      this.showLoadingToast('Loading');
      this.resetQuestionForm();
      this.sectionService.fetchSectionOnClassId(claass.id).subscribe((data:any)=>{
        this.sections = data;
        this.closeToast();
      },(err:any)=>{
        this.showErrorToast('Error fetching sections');
      });
      this.subjectService.fetchSubjectsOnClassId(claass.id).subscribe((data:any)=>{
        this.subjects=data;
        this.closeToast();
      },(err:any)=>{
        this.showErrorToast('Error fetching subjects');
      });
  }
  

  onSectionChange(){
    this.showLoadingToast('Loading');
    this.resetQuestionForm();
    this.subjectService.fetchSubjectsOnClassIdAndSectionId(this.paper.claass.id,this.paper.section.id).subscribe((data:any)=>{
        this.subjects = data;
        this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Error fetching subjects');
    });
  }

  onSubmitForm(){
    this.showLoadingToast('Loading');
    this.paper.questions = this.questions;
    this.paperService.save(this.paper).subscribe((response:any)=>{
          if(this.edit){
            if(response.status ==200){
              var i = this.papers.findIndex(x=>x.id==response.body['id']);
              this.papers[i] = <Paper>response.body;
              this.resetQuestionForm();
              this.edit=false;
              this.myForm.reset();
              this.showSuccessToast('Paper updated');
            }else if(response.status==208){
              this.showErrorToast('Paper already exists');
            }else{
              this.showErrorToast('Something went wrong.Please try again.');
            }
            
          }
          else
            {
              if(response.status==200){
                this.papers.unshift(response.body);
                this.myForm.reset();
                this.resetQuestionForm();
                this.showSuccessToast('Paper Added');
              }else if(response.status==208){
                this.showErrorToast('Paper already exists');
              }else{
                this.showErrorToast('Something went wrong.Please try again.');
              }
              
            }
    });
  }

  editPaper(id){
    this.showLoadingToast("Loading Paper");
    this.edit=true;
      this.paper = this.papers.find(p=>p.id==id);
      this.sectionService.fetchSectionOnClassId(this.paper.claass.id).subscribe((data:any)=>{
        this.sections = data;
        this.closeToast();
      },(err:any)=>{
        this.showErrorToast('Error fetching sections');
      });
      if(this.paper.section.id){
        this.subjectService.fetchSubjectsOnClassIdAndSectionId(this.paper.claass.id,this.paper.section.id).subscribe((data:any)=>{
          this.subjects = data;
          this.closeToast();
      },(err:any)=>{
          this.showErrorToast('Error fetching subjects');
        });
      }
      else{
        this.subjectService.fetchSubjectsOnClassId(this.paper.claass.id).subscribe((data:any)=>{
          this.subjects=data;
          this.closeToast();
        },(err:any)=>{
          this.showErrorToast('Error fetching subjects');
        });
      }     
      this.paperService.fetchQuestionsOfPaper(id).subscribe((data:any)=>{
        this.questions=data;
        this.question=this.questions[0];
        this.questionIndex=0;
        this.closeToast();
      },(err:any)=>{
        this.showErrorToast('Error fetching papers');
      });

  } 

  deletePaper(id){
    this.showLoadingToast('Deleting Exam Date');
      this.paperService.deleteOne(id).subscribe((response:any)=>{
            if(response.status == 200) {
              this.papers = this.papers.filter(i=>i.id !== id);  
              this.closeToast();
            } 
            else if(response.status==208) 
               this.showErrorToast('Exam Date cannot be delete')
            else 
                this.showErrorToast('Exam Date cannot be delete')
      },(err:HttpErrorResponse)=>{
        this.showErrorToast('Something went wrong,Please try again');
      });
    }
  
  addQuestion(index){
   
    if(index==this.questions.length){
      this.question=new Question();
      this.questions.push(this.question);
      this.qstnModelGroup.reset();
      this.questionIndex=index;

    }
    else{
      this.question=new Question();
      this.questions.push(this.question);
      this.qstnModelGroup.reset();
      this.questionIndex=this.questions.length-1;

    }
    
      
  }

  nextQuestion(index){
    if(index<this.questions.length){
      this.question = this.questions[index];
      this.questionIndex=index;
    }
  }

  previousQuestion(index){
      if(index>=0){
          this.question=this.questions[index];
          this.questionIndex=index;
      }
  }

  deleteQuestion(index){
      
       if((index+1) == this.questions.length){   //check if last element deleted
          this.questions.splice(index,1);
          console.log('i m in last element')
          this.question = this.questions[index-1];
          this.questionIndex=index-1
       }else{
          this.questions.splice(index,1);
          this.question = this.questions[index];
          this.questionIndex = index;
       }
  }

  selectOnId(item1,item2){
    return item1?.id == item2?.id;
  }



  resetForm(){
    this.questions=[];
    this.myForm.reset();
    this.edit=false;
  }

  showSuccessToast(message){
        this.closeToast();
        this.successToast=true;
        this.toastMessage=message;
  }

  showErrorToast(message){
    this.closeToast();
      this.errorToast=true;
      this.toastMessage=message;
  }

  showLoadingToast(message){
    this.closeToast();
    this.loadingToast=true;
    this.toastMessage=message;
  }

  

  closeToast(){
    this.successToast=false;
    this.errorToast=false;
    this.loadingToast=false;
  }

  resetQuestionForm(){
    this.qstnModelGroup?.reset()
    this.questions=[]
    this.questionIndex=0;
    this.question= new Question();
    this.questions.push(this.question);
  }

  onCancel(index){
    this.qstnModelGroup.reset()
    this.questions[index]=new Question();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
