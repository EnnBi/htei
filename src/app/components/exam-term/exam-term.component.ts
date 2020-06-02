import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExamTermService } from 'src/app/services/exam-term.service';
import { SharedService } from 'src/app/services/shared.service';

export class ExamTerm{
  id:number;
  name:string;
}


@Component({
  selector: 'app-exam-term',
  templateUrl: './exam-term.component.html',
  styleUrls: ['./exam-term.component.css']
})
export class ExamTermComponent implements OnInit {

  constructor(private examTermService:ExamTermService,private sharedService:SharedService) { }
  @ViewChild('myForm') myForm:NgForm;

  examTerms:ExamTerm[] = [];
  examTerm = new ExamTerm();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';

  ngOnInit(): void {
    this.sharedService.school.subscribe((data:any)=>{
        this.initData();
    });
    this.initData();
  }

  initData(){
    this.examTermService.fetchAll().subscribe((data:ExamTerm[])=>{
      this.examTerms= data;
    });
  }

  onSubmitForm(){
    this.closeToast();
    this.examTermService.save(this.examTerm).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.examTerms.findIndex(x=>x.id==response.body['id']);
          this.examTerms[i] = <ExamTerm>response.body;
          this.edit=false;
          this.showToast('ExamTerm updated',true);
          this.myForm.reset();

        }else if(response.status==208){
          this.showToast('ExamTerm already exists',false);
        }else{
          this.showToast('Something went wrong.Please try again.',false);
        }
      } 
      else
        {
          if(response.status==200){
            this.examTerms.unshift(<ExamTerm>response.body);
            this.showToast('ExamTerm added',true);
            this.myForm.reset();

          }else if(response.status==208){
            this.showToast('ExamTerm already exists',false);
          }else{
            this.showToast('Something went wrong.Please try again.',false);
          }
        }
    });
  }
  
  fetchOne(id){
    this.examTerm = this.examTerms.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.closeToast();
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.examTermService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.examTerms = this.examTerms.filter(i=>i.id !== id);
        this.showToast('Exam Term deleted',true)
      }
       else if(res.status==409){
            this.showToast('ExamTerm cannot be deleted',false);
       }else{
         this.showToast('Something went wrong.Please try again.',false);
       }
    });
  } 

  resetForm(){
    this.myForm.reset();
    this.edit=false;

  }

  showToast(message,val){
    if(val)
      this.successToast=true;
    else
      this.failureToast=true;

    this.toastMessage=message;
  }

  closeToast(){
  this.successToast=false;
  this.failureToast=false;
  }

}
