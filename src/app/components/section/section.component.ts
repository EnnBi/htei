import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SectionService } from 'src/app/services/section.service';
import { SharedService } from 'src/app/services/shared.service';
import { School } from '../school/school.component';
import { SchoolService } from 'src/app/services/school.service';

export class Section{
  id:number;
  name:string;
}

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})


export class SectionComponent implements OnInit {
  
  constructor(private sectionService:SectionService,private sharedService:SharedService) { }
  
  @ViewChild('myForm') myForm:NgForm;

  sections:Section[] = [];
  section:Section={
    id:0,
    name:''
  } 
  edit:boolean=false;
  successToast:boolean=false;
  failureToast:boolean=false;
  toastMessage:string='';

  initData(){
    this.sectionService.fetchAllSections().subscribe((data:Section[])=>{
      this.sections = data;
    });
  }

  ngOnInit(): void {
    console.log('i m in section')
    this.showToast('Loading',true);
    this.sharedService.school.subscribe((data:School)=>{
      this.myForm.reset()
        this.initData();
    });
    this.initData();
  }

  onSubmitForm(){
    this.sectionService.saveSection(this.section).subscribe(data=>{
      if(this.edit){
        var i = this.sections.findIndex(x=>x.id==data.id);
        this.sections[i] = data;
        this.edit=false;
        this.showToast('Section updated',true);
      }
      else
        {
          this.sections.unshift(data);
          this.showToast('Section added',true);
        }
    });
    this.myForm.reset();
  }

  fetchOne(id){
    /* this.sectionService.fetchOne(id).subscribe((data)=>{
      this.section = data;
      this.edit=true;
    }); */
    this.section = this.sections.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
      console.log(this.myForm.value['id']);
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }

    this.sectionService.deleteOne(id).subscribe((res:any)=>{
      if(res.status == 200){
        this.sections = this.sections.filter(i=>i.id !== id);
        this.showToast('Section deleted',true)
        console.log(this.sections);
      }
       else {
            this.showToast('Section cannot be deleted',false);
       }
    });
  } 

  showToast(message,val){
    console.log(' it shud now sow yoast')
        if(val)
          this.successToast=true;
        else
          this.failureToast=true;

        this.toastMessage=message;
  }

  closeToast(){
    console.log('closin gtoast')
    this.successToast=false;
    this.failureToast=false;
  }
}
