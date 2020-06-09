import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class ExamTermComponent implements OnInit,OnDestroy {

  constructor(private examTermService:ExamTermService,private sharedService:SharedService) { }
  @ViewChild('myForm') myForm:NgForm;

  examTerms:ExamTerm[] = [];
  examTerm = new ExamTerm();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
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
    this.showLoadingToast('Loading')
    this.examTermService.fetchAll().subscribe((data:ExamTerm[])=>{
      this.examTerms= data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  onSubmitForm(){
    this.showLoadingToast('Saving Exam Term');
    this.examTermService.save(this.examTerm).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.examTerms.findIndex(x=>x.id==response.body['id']);
          this.examTerms[i] = <ExamTerm>response.body;
          this.edit=false;
          this.showSuccessToast('ExamTerm updated');
          this.myForm.reset();
        }else if(response.status==208){
          this.showErrorToast('ExamTerm already exists');
        }else{
          this.showErrorToast('Something went wrong.Please try again.');
        }
      } 
      else
        {
          if(response.status==200){
            this.examTerms.unshift(<ExamTerm>response.body);
            this.showSuccessToast('ExamTerm added');
            this.myForm.reset();

          }else if(response.status==208){
            this.showErrorToast('ExamTerm already exists');
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
        }
    });
  }
  
  fetchOne(id){
    this.examTerm = this.examTerms.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.showLoadingToast('Deleting Exam Term');

    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.examTermService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.examTerms = this.examTerms.filter(i=>i.id !== id);
        this.showSuccessToast('Exam Term deleted')
      }
       else if(res.status==409){
            this.showErrorToast('ExamTerm cannot be deleted');
       }else{
         this.showErrorToast('Something went wrong.Please try again.');
       }
    });
  } 

  resetForm(){
    this.myForm.reset();
    this.edit=false;

  }

  
  showSuccessToast(message){
    this.closeToast()
    this.successToast=true;
    this.toastMessage=message;
  }
  
  showErrorToast(message){
  this.closeToast()
  this.failureToast=true;
  this.toastMessage=message;
  }
  
  showLoadingToast(message){
  this.closeToast()
  this.loadingToast=true;
  this.toastMessage=message;
  }
  
  closeToast(){
    this.successToast=false;
    this.failureToast=false;
    this.loadingToast=false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
