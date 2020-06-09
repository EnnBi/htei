import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Section } from '../section/section.component';
import { ClassService } from 'src/app/services/class.service';
import { SectionService } from 'src/app/services/section.service';
import { Subject } from '../subject/subject.component';
import { Teacher } from '../teacher/teacher.component';
import { SharedService } from 'src/app/services/shared.service';
import { School } from '../school/school.component';
import { ClassSubjectTeacher } from '../subject-teacher/subject-teacher.component';

import { of } from 'rxjs';

export class Class{
  id?:number;
  name?:string;
  sections?:Section[];
  classSubjectTeachers?:ClassSubjectTeacher[]
}





@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})

export class ClassComponent implements OnInit,OnDestroy {
  @ViewChild('myForm') myForm:NgForm;




  class:Class;
  classes:Class[]=[];
  sections:Section[]=[];

  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  loadingToast:boolean=false;
  subscription:any;
  toastMessage:string='';
  searchTxt:string='';
  constructor(private classService:ClassService,private sectionService:SectionService,
              private sharedService:SharedService) { }

  initData(){
    this.showLoadingToast('Loading.Please wait')
    this.class=this.initialize();
    this.myForm?.reset()
    this.classService.fetchClassesWithSections().subscribe((data:any)=>{
      this.classes= data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.sectionService.fetchAllSections().subscribe((data:Section[])=>{
      this.sections=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }
  
  ngOnInit(): void {
    this.class=this.initialize();
    this.subscription = this.sharedService.school.subscribe((data:School)=>{
      if(this.sharedService.getSchool)
        this.initData();
    });  
  } 

 

  onSubmitForm(){
    this.showLoadingToast('Saving Class');
    this.classService.save(this.class).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.classes.findIndex(x=>x.id==response.body['id']);
          this.classes[i] = <Class>response.body;
          this.edit=false;
          this.showSuccessToast('Class updated');
          this.myForm.reset();
          this.class.classSubjectTeachers=[]

        }else if(response.status==208){
          this.showErrorToast('Class already exists');
        }else{
          this.showErrorToast('Something went wrong.Please try again.');
        }
        
      }
      else
        {
          if(response.status==200){
            this.classes.unshift(<Class>response.body);
            this.showSuccessToast('Class added');
            this.myForm.reset();
            this.class.classSubjectTeachers=[]
          }else if(response.status==208){
            this.showErrorToast('Class already exists');
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
          
        }
    });
  }

  fetchOne(id){
    this.class = this.classes.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.closeToast();
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.classService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.classes = this.classes.filter(i=>i.id !== id);
        this.showSuccessToast('Class deleted')
      }
       else if(res.status==409){
            this.showErrorToast('Class cannot be deleted');
       }else{
         this.showErrorToast('Something went wrong.Please try again.');
       }
    });
  } 


 
 
  resetForm(){
    this.class.classSubjectTeachers=[]
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

  initialize(){
     
     
    let c:Class = {
        id:0,
        name:'',
        sections:[],
        classSubjectTeachers:[]
    }
      return c;
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}
