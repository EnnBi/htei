import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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


export class SectionComponent implements OnInit,OnDestroy {
  
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
  loadingToast:boolean=false;
  toastMessage:string='';
  subscription:any;

  initData(){
    this.myForm?.reset()
    this.showLoadingToast('Loading');
    this.sectionService.fetchAllSections().subscribe((data:Section[])=>{
      this.sections = data;
      this.closeToast();
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
  }

  ngOnInit(): void {
   this.subscription =  this.sharedService.school.subscribe((data:School)=>{
        this.initData();
    });
  }

  onSubmitForm(){
    this.showLoadingToast('Saving Section');
    this.sectionService.saveSection(this.section).subscribe(data=>{
      this.closeToast();
      if(this.edit){
        var i = this.sections.findIndex(x=>x.id==data.id);
        this.sections[i] = data;
        this.edit=false;
        this.showSuccessToast('Section updated');

      } 
      else 
        {
          this.sections.unshift(data);
          this.showSuccessToast('Section added');
        }
        
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
    this.myForm.reset();
  }

  fetchOne(id){
    this.section = this.sections.find(o=> o.id== +id);
    this.edit=true;
  }

  deleteOne(id){
    this.showLoadingToast('Deleting Section');
    if(this.edit){
      this.myForm.reset();
      this.edit=false;
    }

    this.sectionService.deleteOne(id).subscribe((res:any)=>{
      this.closeToast();
      if(res.status == 200){
        this.sections = this.sections.filter(i=>i.id !== id);
        this.showSuccessToast('Section deleted',)
      }
       else {
            this.showErrorToast('Section cannot be deleted');
       }
    },(err:any)=>{
      this.showErrorToast('Something went wrong,Please try again');
    });
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


