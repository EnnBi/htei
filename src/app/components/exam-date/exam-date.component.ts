import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ClassService } from 'src/app/services/class.service';
import { SharedService } from 'src/app/services/shared.service';
import { ExamDateService } from 'src/app/services/exam-date.service';
import { Class } from '../class/class.component';
import { ExamTerm } from '../exam-term/exam-term.component';
import { Paper } from '../paper/paper.component';
import { Time } from '@angular/common';
import { PaperService } from 'src/app/services/paper.service';
import { SectionService } from 'src/app/services/section.service';
import { Section } from '../section/section.component';
import { ExamTermService } from 'src/app/services/exam-term.service';
import { Observable, of, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
export class ExamDate{
  id:number;
  paper:Paper;
  date:Date;
  startTime:Date;
  endTime:Date;
  questionDuration:number
}

@Component({
  selector: 'app-exam-date',
  templateUrl: './exam-date.component.html',
  styleUrls: ['./exam-date.component.css']
})
export class ExamDateComponent implements OnInit,OnDestroy {
  
  @ViewChild('myForm') myForm:NgForm;

  constructor(private classService:ClassService,private sharedService:SharedService,
              private paperService:PaperService,private sectionService:SectionService,
              private examTermService:ExamTermService,private examDateService:ExamDateService) { }

  classes:Class[]=[];
  terms:ExamTerm[]=[];
  examDates:ExamDate[]=[];
  sections:Section[]=[];
  papers:Paper[]=[];
  claass:Class;
  examTerm:ExamTerm;
  examDate:ExamDate;
  section:Section;

  edit:boolean=false;
  successToast:boolean=false;
  errorToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';

  subscription:any;

  ngOnInit(): void {
   this.subscription = this.sharedService.school.subscribe((data:any)=>{
      this.initData();
    });
  }

  initData(){
    this.claass=new Class();
    this.section=new Section();
    this.examDates=[];
    this.showLoadingToast('Loading')

    this.classService.fetchAll().subscribe((data:any)=>{
        this.classes = data;
        this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });

    this.examTermService.fetchAll().subscribe((data:any)=>{
      this.terms=data;
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });

  }

  onSubmit(){
    this.showLoadingToast('Saving Exam Dates');
    this.examDateService.save(this.examDates).subscribe((response:any)=>{
        if(response.status==200){
            this.showSuccessToast("Exam Dates Saved");
            this.myForm.reset();
            this.examDates = [];
        }
    },(err:HttpErrorResponse)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  onClassChange(claass){
    
    if(!this.claass)
      return null;
    
    this.showLoadingToast('Loading...')
    this.sectionService.fetchSectionOnClassId(this.claass.id).subscribe((data:any)=>{
      this.sections=data;
      this.closeToast();
    },(err:HttpErrorResponse)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    
    
      if(this.claass && this.examTerm){
        this.showLoadingToast('Loading...')
        if(!this.section.id)
            this.section= <any>{id:0}
        
        this.paperService.fetchPapersOfClassSectionTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
          this.papers=data;
          this.closeToast();
        },(err:HttpErrorResponse)=>{
          this.showErrorToast('Something went wrong,Please try again');
        });

        this.examDateService.fetchOnClassAndSectionAndTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
          this.examDates=data;
          this.closeToast();
        },(err:HttpErrorResponse)=>{
          this.showErrorToast('Something went wrong,Please try again');
        });
      }

      
  }

  onSectionChange(){
    if(this.claass && this.examTerm){
      this.showLoadingToast('Loading...')

      if(!this.section.id)
            this.section= <any>{id:0}
        this.paperService.fetchPapersOfClassSectionTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
          this.papers=data;
          this.closeToast();
        },(err:HttpErrorResponse)=>{
          this.showErrorToast('Something went wrong,Please try again');
        });
        this.examDateService.fetchOnClassAndSectionAndTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
          this.examDates=data;
          this.closeToast();
        },(err:HttpErrorResponse)=>{
          this.showErrorToast('Something went wrong,Please try again');
        });
    }
  }
  
  onTermChange(){
    if(this.claass && this.examTerm){
      this.showLoadingToast('Loading')
        if(!this.section.id)
            this.section= <any>{id:0}


          this.paperService.fetchPapersOfClassSectionTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
            this.papers=data;
            this.closeToast();
            console.log(this.papers)
          },(err:HttpErrorResponse)=>{
            this.showErrorToast('Something went wrong,Please try again');
          });
          this.examDateService.fetchOnClassAndSectionAndTerm(this.claass.id,this.section.id,this.examTerm.id).subscribe((data:any)=>{
            this.examDates=data;
            this.closeToast();

          },(err:HttpErrorResponse)=>{
            this.showErrorToast('Something went wrong,Please try again');
          });
      }
      console.log(this.examDates)
    }

    onDelete(index,id){
      this.showLoadingToast('Deleting Exam Date');
          if(+id>0){
            this.examDateService.deleteOne(id).subscribe((response:any)=>{
                  if(response.status == 200) {
                    this.examDates.splice(+index,1);
                    this.closeToast();
                  } 
                  else 
                      this.showErrorToast('Exam Date cannot be delete')
            },(err:HttpErrorResponse)=>{
              this.showErrorToast('Something went wrong,Please try again');
            });
          }else{
            this.examDates.splice(+index,1);
            this.closeToast();
          }
    }

  selectOnId(item1,item2){
    if(item2)
      return item1.id == item2.id;
    else
      return false;  
  }



  addExamDate(){
    this.examDates.push(new ExamDate());
  }

  alreadySelected(id){
    const ids = this.examDates?.map(ed => +ed.paper?.id);
    return ids.includes(+id);
  }  
  showSuccessToast(message){
    this.closeToast()
    this.successToast=true;
    this.toastMessage=message;
  }
  
  showErrorToast(message){
  this.closeToast()
  this.errorToast=true;
  this.toastMessage=message;
  }
  
  showLoadingToast(message){
  this.closeToast()
  this.loadingToast=true;
  this.toastMessage=message;
  }
  
  closeToast(){
    this.successToast=false;
    this.errorToast=false;
    this.loadingToast=false;
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
