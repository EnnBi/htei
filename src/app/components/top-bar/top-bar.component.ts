import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/services/school.service';
import { School } from '../school/school.component';
import { SharedService } from 'src/app/services/shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  schools:School[];
  school:School;

  constructor(private schoolService:SchoolService,private sharedService:SharedService,
              private authService:AuthenticationService,private router:Router) { }
  
  ngOnInit(): void {
      this.school=new School();
      this.school = this.sharedService.getSchool();
      this.schools = this.sharedService.getSchools();
      if(!this.school){
        this.schoolService.fetchAll().subscribe((data:School[])=>{
          this.schools=data;
          this.school = this.schools[0];
          localStorage.setItem('schools',JSON.stringify(this.schools));
          localStorage.setItem('school',JSON.stringify(this.school));
        });
      }
      console.log('firing next')
      this.sharedService.school.next(this.school);      
  }

  schoolChanged(s){
        this.school = s;
        console.log('setting storage and fecthing next')
        localStorage.setItem('school',JSON.stringify(this.school));
        this.sharedService.school.next(s);
                
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
