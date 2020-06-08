import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectService } from 'src/app/services/subject.service';
import { NgForm } from '@angular/forms';

export class Subject{
  id:number;
  name:string;
}

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  constructor(private subjectService:SubjectService) { }
  @ViewChild('myForm') myForm:NgForm;

  subjects:Subject[] = [];
  subject:Subject={
    id:0,
    name:''
  } 
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';

  ngOnInit(): void {
    this.myForm?.reset()
    this.showLoadingToast('Loading');
    this.subjectService.fetchAll().subscribe((data:Subject[])=>{
      this.subjects= data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  onSubmitForm(){
    this.closeToast();
    this.showLoadingToast('Saving Subject');
    this.subjectService.save(this.subject).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.subjects.findIndex(x=>x.id==response.body['id']);
          this.subjects[i] = <Subject>response.body;
          this.edit=false;
          this.myForm.reset();
          this.showSuccessToast('Subject updated');

        }else if(response.status==208){
          this.showErrorToast('Subject already exists');
        }else{
          this.showErrorToast('Something went wrong.Please try again.');
        }
      } 
      else
        {
          if(response.status==200){
            this.subjects.unshift(<Subject>response.body);
            this.myForm.reset();
            this.showSuccessToast('Subject added');
          }else if(response.status==208){
            this.showErrorToast('Subject already exists');
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
        }
    });
  }
  
  fetchOne(id){
    this.subject = this.subjects.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    
    this.closeToast();
    this.showLoadingToast('Deleting Subject')
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.subjectService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.subjects = this.subjects.filter(i=>i.id !== id);
        this.showSuccessToast('Subject deleted')
      }
       else if(res.status==409){
            this.showErrorToast('Subject cannot be deleted');
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
}
