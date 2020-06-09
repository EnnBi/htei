import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from '../subject/subject.component';
import { Teacher } from '../teacher/teacher.component';
import { SubjectService } from 'src/app/services/subject.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Class } from '../class/class.component';
import { Section } from '../section/section.component';
import { ClassService } from 'src/app/services/class.service';
import { SectionService } from 'src/app/services/section.service';
import { SubjectTeacherService } from 'src/app/services/subject-teacher.service';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

export class ClassSubjectTeacher{
  id?:number;
  claass?:Class;
  subject?:Subject;
  teacher?:Teacher;
  section:Section;
}

@Component({
  selector: 'app-subject-teacher',
  templateUrl: './subject-teacher.component.html',
  styleUrls: ['./subject-teacher.component.css']
})
export class SubjectTeacherComponent implements OnInit,OnDestroy {
  @ViewChild('myForm') myForm:NgForm;

  subjects:Subject[]=[];
  teachers:Teacher[]=[];
  sections:Section[]=[];
  classes:Class[]=[];
  claass:any;
  seection:any;
  csts:ClassSubjectTeacher[]=[];
  info:boolean;
  successToast:boolean=false;
  failureToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';
  cst:ClassSubjectTeacher;  

  subscription:any;

  constructor(private subjectService:SubjectService,private teacherService:TeacherService,
              private classService:ClassService,private sectionService:SectionService,
              private cstService:SubjectTeacherService,private sharedService:SharedService) { }


            

  initData(){
    this.showLoadingToast('Loading....')
    this.info=false
    this.claass={id:0,name:'',sections:[],classSubjectTeachers:[]};
    this.seection={id:0,name:''}; 
     this.csts=[];
    this.classService.fetchAll().subscribe((data:any)=>{
      this.classes=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  ngOnInit(): void {
     this.subscription = this.sharedService.school.subscribe((data:any)=>{
       this.initData();
     });

  }
  onSubmitForm(){
    this.showLoadingToast('Assigning subjects and teachers to class')
    this.cstService.save(this.csts).subscribe(response=>{
          if(response.status==200){
            this.showSuccessToast('Subjects and Teachers added');
            this.csts=[];
            this.myForm.reset();
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
    });
      
  }
  onClassChange(data){
    if(!data)
      return null;
    this.info=false;
    this.csts=[];
    this.seection= new Section();
    this.sections=[];
    this.sectionService.fetchSectionOnClassId(data).subscribe((data:any)=>{
      this.sections=data;
    });
  }
  
  onSectionChange(data){
    if(!data)
      return null;
    this.info=true;
    this.showLoadingToast('Loading Subjects and Teachers')
    this.csts = [];
    this.subjectService.fetchAll().subscribe((data:Subject[])=>{
      this.subjects=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.teacherService.fetchAll().subscribe((data:Teacher[])=>{
      this.teachers=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.cstService.fetchonClassAndSection(this.claass.id,this.seection.id).subscribe((data:ClassSubjectTeacher[])=>{
      this.csts = data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }


  addSubjectTeacher(){
     this.cst = new ClassSubjectTeacher();
     this.cst.subject=new Subject();
     this.cst.teacher=new Teacher();
     this.cst.claass=this.claass;
     this.cst.section=this.seection;
    this.csts.push(this.cst);
     
  }

  deleteSubjectTeacher(index,id){
    this.showLoadingToast('Deleting')
    if(+id>0){
        this.cstService.deleteOne(id).subscribe((response:any)=>{
              if(response.status == 200){
                this.csts.splice(+index,1);
                this.closeToast();
              }
              else{
                this.showErrorToast('Subject Teacher cannot be deleted');
              }
        });
      }else{
        this.csts.splice(+index,1);
        this.closeToast();
      }
  }

  alreadySelected(id){
    const ids = this.csts?.map(i => +i.subject.id);
    return ids.includes(+id);
  }
 
  resetForm(){
      this.myForm.reset();
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
