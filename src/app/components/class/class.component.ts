import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Section } from '../section/section.component';
import { ClassService } from 'src/app/services/class.service';
import { SectionService } from 'src/app/services/section.service';
import { Subject } from '../subject/subject.component';
import { Teacher } from '../teacher/teacher.component';
import { SharedService } from 'src/app/services/shared.service';
import { School } from '../school/school.component';
import { ClassSubjectTeacher } from '../subject-teacher/subject-teacher.component';



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

export class ClassComponent implements OnInit {
  @ViewChild('myForm') myForm:NgForm;




  class:Class;
  classes:Class[]=[];
  sections:Section[]=[];

  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';
  constructor(private classService:ClassService,private sectionService:SectionService,
              private sharedService:SharedService) { }

  initData(){
    this.classService.fetchAll().subscribe((data:any)=>{
      this.classes = data;
    });
    this.sectionService.fetchAllSections().subscribe((data:Section[])=>{
      this.sections=data;
    });
  }
  
  ngOnInit(): void {
    this.class=this.initialize();
    this.sharedService.school.subscribe((data:School)=>{
      this.class=this.initialize();
      this.myForm.reset()
        this.initData();
    });
  }

 

  onSubmitForm(){
    console.log(this.class);
    this.closeToast();
    this.classService.save(this.class).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.classes.findIndex(x=>x.id==response.body['id']);
          this.classes[i] = <Class>response.body;
          this.edit=false;
          this.showToast('Class updated',true);
          this.myForm.reset();
          this.class.classSubjectTeachers=[]

        }else if(response.status==208){
          this.showToast('Class already exists',false);
        }else{
          this.showToast('Something went wrong.Please try again.',false);
        }
        
      }
      else
        {
          if(response.status==200){
            this.classes.unshift(<Class>response.body);
            this.showToast('Class added',true);
            this.myForm.reset();
            this.class.classSubjectTeachers=[]
          }else if(response.status==208){
            this.showToast('Class already exists',false);
          }else{
            this.showToast('Something went wrong.Please try again.',false);
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
        this.showToast('Class deleted',true)
      }
       else if(res.status==409){
            this.showToast('Class cannot be deleted',false);
       }else{
         this.showToast('Something went wrong.Please try again.',false);
       }
    });
  } 


 
 
  resetForm(){
    this.class.classSubjectTeachers=[]
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

  initialize(){
     
     
    let c:Class = {
        id:0,
        name:'',
        sections:[],
        classSubjectTeachers:[]
    }
      return c;
  }
}
