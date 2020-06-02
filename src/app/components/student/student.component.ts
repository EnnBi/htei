import { Component, OnInit, ViewChild } from '@angular/core';
import { Class } from '../class/class.component';
import { StudentService } from 'src/app/services/student.service';
import { ClassService } from 'src/app/services/class.service';
import { NgForm } from '@angular/forms';
import { Section } from '../section/section.component';
import { SectionService } from 'src/app/services/section.service';
import { SharedService } from 'src/app/services/shared.service';

export class Student{
  id:number;
  firstName:string;
  lastName:string;
  address:string;
  phoneNumber:number;
  claass:Class;
  section:Section;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @ViewChild('myForm') myForm:NgForm;


  classes:Class[]=[];
  sections:Section[]=[];
  students:Student[]=[];
  student:Student= new Student();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';
  constructor(private studentService:StudentService,private classService:ClassService,
              private sectionService:SectionService,private sharedService:SharedService) { }

  initData(){
    this.student.claass = new Class();
    this.student.section=new Section();
  
    this.studentService.fetchAll().subscribe((data:any)=>{
      this.students = data;
    });
    this.classService.fetchAll().subscribe((data:Class[])=>{
      console.log(data)
      this.classes=data;
    });
    console.log(this.classes)
  }

  ngOnInit(): void {
    this.sharedService.school.subscribe((data:any)=>{
      this.initData();

    })
    this.initData();
  }

  onSubmitForm(){
    this.closeToast();
    this.studentService.save(this.student).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.students.findIndex(x=>x.id==response.body['id']);
          this.students[i] = <Student>response.body;
          this.edit=false;
          this.showToast('Student updated',true);
          this.myForm.reset();

        }else if(response.status==208){
          this.showToast('Student already exists',false);
        }else{
          this.showToast('Something went wrong.Please try again.',false);
        }
        
      }
      else
        {
          if(response.status==200){
            this.students.unshift(<Student>response.body);
            this.showToast('Student added',true);
            this.myForm.reset();

          }else if(response.status==208){
            this.showToast('Student already exists',false);
          }else{
            this.showToast('Something went wrong.Please try again.',false);
          }
          
        }
    });
  }

  onClassChange(data){
    this.sectionService.fetchSectionOnClassId(data).subscribe((data:any)=>{
      this.sections=data;
    });
  }

  fetchOne(id){
    this.student = this.students.find(o=> o.id== +id);
    this.sectionService.fetchSectionOnClassId(this.student.claass.id).subscribe((data:any)=>{
      this.sections=data;
    });
    this.edit=true;
  }

  deleteOne(id){
    this.closeToast();
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.studentService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.students = this.students.filter(i=>i.id !== id);
        this.showToast('Student deleted',true)
      }
       else if(res.status==409){
            this.showToast('Student cannot be deleted',false);
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

        console.log(this.toastMessage);
        this.toastMessage=message;
  }

  closeToast(){
    this.successToast=false;
    this.failureToast=false;
  }

}
