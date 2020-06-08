import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { ClassService } from 'src/app/services/class.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { School } from '../school/school.component';
import { SchoolService } from 'src/app/services/school.service';
import { SharedService } from 'src/app/services/shared.service';

export class Teacher{
  id:number;
  firstName:string;
  lastName:string;
  address:string;
  phoneNumber:number;
  school:School;
}

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  @ViewChild('myForm') myForm:NgForm;


  teachers:Teacher[]=[];
  currentSchool:School;
  schools:School[]=[];
  teacher:Teacher= new Teacher();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';
  constructor(private teacherService:TeacherService,private schoolService:SchoolService,
              private sharedService:SharedService) { }

  initData(){
    this.myForm?.reset()
    this.showLoadingToast('Loading');
    this.teacher.school=new School();
    this.teacherService.fetchAll().subscribe((data:any)=>{
      this.teachers = data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.schoolService.fetchAll().subscribe((data:School[])=>{
      this.schools=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  ngOnInit(): void {
    this.currentSchool=this.sharedService.getSchool();
    this.sharedService.school.subscribe((data:any)=>{
      this.currentSchool=data;
      this.initData();
    })
    this.initData();
  }

  onSubmitForm(){
    this.closeToast();
    this.showLoadingToast('Saving Teacher');
    this.teacherService.save(this.teacher).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          if(this.currentSchool.id == response.body['school'].id){
            var i = this.teachers.findIndex(x=>x.id==response.body['id']);
            this.teachers[i] = <Teacher>response.body;
          }
          this.edit=false;
          this.showSuccessToast('Teacher updated');
          this.myForm.reset();

        }else if(response.status==208){
          this.showErrorToast('Teacher already exists');
        }else{
          this.showErrorToast('Something went wrong.Please try again.');
        }
        
      }
      else
        {
          if(response.status==200){
            if(this.currentSchool.id == response.body['school'].id){
              this.teachers.unshift(<Teacher>response.body);
           }
            this.showSuccessToast('Teacher added');
            this.myForm.reset();

          }else if(response.status==208){
            this.showErrorToast('Teacher already exists');
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
          
        }
    });
  }

  fetchOne(id){
    this.teacher = this.teachers.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.closeToast();
    this.showLoadingToast('Deleting Teacher')
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.teacherService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.teachers = this.teachers.filter(i=>i.id !== id);
        this.showSuccessToast('Teacher deleted')
      }
       else if(res.status==409){
            this.showErrorToast('Teacher cannot be deleted');
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
