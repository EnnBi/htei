import { Component, OnInit, ViewChild } from '@angular/core';
import { SchoolService } from 'src/app/services/school.service';
import { NgForm } from '@angular/forms';


export class School{
  id:number;
  name:string;
}


@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {


  constructor(private schoolService:SchoolService) { }
  @ViewChild('myForm') myForm:NgForm;

  schools:School[] = [];
  school = new School();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';

  ngOnInit(): void {
    this.schoolService.fetchAll().subscribe((data:School[])=>{
      this.schools= data;
    });
  }

  onSubmitForm(){
    this.closeToast();
    this.schoolService.save(this.school).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.schools.findIndex(x=>x.id==response.body['id']);
          this.schools[i] = <School>response.body;
          this.edit=false;
          this.showToast('School updated',true);
          this.myForm.reset();

        }else if(response.status==208){
          this.showToast('School already exists',false);
        }else{
          this.showToast('Something went wrong.Please try again.',false);
        }
      } 
      else
        {
          if(response.status==200){
            this.schools.unshift(<School>response.body);
            this.showToast('School added',true);
            this.myForm.reset();

          }else if(response.status==208){
            this.showToast('School already exists',false);
          }else{
            this.showToast('Something went wrong.Please try again.',false);
          }
        }
    });
  }
  
  fetchOne(id){
    this.school = this.schools.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.closeToast();
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.schoolService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.schools = this.schools.filter(i=>i.id !== id);
        this.showToast('School deleted',true)
      }
       else if(res.status==409){
            this.showToast('School cannot be deleted',false);
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
