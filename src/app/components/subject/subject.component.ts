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
  toastMessage:string='';
  searchTxt:string='';

  ngOnInit(): void {
    this.subjectService.fetchAll().subscribe((data:Subject[])=>{
      this.subjects= data;
    });
  }

  onSubmitForm(){
    this.closeToast();
    console.log('are we here ')
    this.subjectService.save(this.subject).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.subjects.findIndex(x=>x.id==response.body['id']);
          this.subjects[i] = <Subject>response.body;
          this.edit=false;
          this.showToast('Subject updated',true);
          this.myForm.reset();

        }else if(response.status==208){
          this.showToast('Subject already exists',false);
        }else{
          this.showToast('Something went wrong.Please try again.',false);
        }
      } 
      else
        {
          if(response.status==200){
            this.subjects.unshift(<Subject>response.body);
            this.showToast('Subject added',true);
            this.myForm.reset();

          }else if(response.status==208){
            this.showToast('Subject already exists',false);
          }else{
            this.showToast('Something went wrong.Please try again.',false);
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
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.subjectService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.subjects = this.subjects.filter(i=>i.id !== id);
        this.showToast('Subject deleted',true)
      }
       else if(res.status==409){
            this.showToast('Subject cannot be deleted',false);
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
