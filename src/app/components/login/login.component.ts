import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';


export class LoginUser{
  username:string;
  password:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService,private route:Router,
              private sharedService:SharedService) { }
  
  user:LoginUser;
  errorToast=false;
  toastMessage='';

  ngOnInit(): void {
    let token = this.sharedService.getToken();
    if(token){
      this.route.navigateByUrl('/class');
    }
    this.user={username:'',password:''};
  }

  onSubmit(){
      this.closeToast();
      this.authenticationService.authenticate(this.user).subscribe((data:any)=>{
        if(data==200){
          console.log('navigate to class')
              this.route.navigateByUrl('/class')
          }else if(data==401){
              this.showToast('Wrong Credentials');
          }
          else{
            this.showToast('Something went wrong.Please try again');
          }
      });
  }

  showToast(message){
    this.toastMessage=message;
    this.errorToast=true;
  }

  closeToast(){
    this.errorToast=false;
  }
}
