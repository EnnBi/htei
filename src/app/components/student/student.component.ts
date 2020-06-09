import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class StudentComponent implements OnInit,OnDestroy {
  @ViewChild('myForm') myForm:NgForm;


  classes:Class[]=[];
  sections:Section[]=[];
  students:Student[]=[];
  student:Student= new Student();
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  loadingToast:boolean=false;
  toastMessage:string='';
  searchTxt:string='';

  subscription:any;

  constructor(private studentService:StudentService,private classService:ClassService,
              private sectionService:SectionService,private sharedService:SharedService) { }

  initData(){
    this.student.claass = new Class();
    this.student.section=new Section();
    this.showLoadingToast('Loading');
    this.studentService.fetchAll().subscribe((data:any)=>{
      this.students = data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.classService.fetchAll().subscribe((data:Class[])=>{
      this.classes=data;
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  ngOnInit(): void {
    this.subscription = this.sharedService.school.subscribe((data:any)=>{
      this.initData();

    })
  }

  onSubmitForm(){
    this.closeToast();
    this.showLoadingToast('Saving Student');
    this.studentService.save(this.student).subscribe(response=>{
      if(this.edit){
        if(response.status ==200){
          var i = this.students.findIndex(x=>x.id==response.body['id']);
          this.students[i] = <Student>response.body;
          this.edit=false;
          this.showSuccessToast('Student updated');
          this.myForm.reset();

        }else if(response.status==208){
          this.showErrorToast('Student already exists');
        }else{
          this.showErrorToast('Something went wrong.Please try again.');
        }
        
      }
      else
        {
          if(response.status==200){
            this.students.unshift(<Student>response.body);
            this.showSuccessToast('Student added');
            this.myForm.reset();

          }else if(response.status==208){
            this.showErrorToast('Student already exists');
          }else{
            this.showErrorToast('Something went wrong.Please try again.');
          }
          
        }
    });
  }

  onClassChange(data){
    if(!data)
      return null;
    
    this.showLoadingToast('Loading Sections')
    this.sections=[]
    this.sectionService.fetchSectionOnClassId(data).subscribe((data:any)=>{
      this.sections=data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Error in loading sections');
    });
  }

  fetchOne(id){
    this.showLoadingToast('Loading')
    this.student = this.students.find(o=> o.id== +id);
    this.sectionService.fetchSectionOnClassId(this.student.claass.id).subscribe((data:any)=>{
      this.sections=data;
      this.edit=true;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Error in loading student');
    });
  }

  deleteOne(id){
    this.closeToast();
    this.showLoadingToast('Deleting Student')
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }
    this.studentService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.students = this.students.filter(i=>i.id !== id);
        this.showSuccessToast('Student deleted')
      }
       else if(res.status==409){
            this.showErrorToast('Student cannot be deleted');
       }else{
         this.showErrorToast('Something went wrong.Please try again.');
       }
    });
  } 

  selectOnId(item1,item2){
    return item1.id == item2.id;
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
