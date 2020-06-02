import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  school:any = {id:0};
  token:string = 'login';
  constructor(private sharedService:SharedService,private authService:AuthenticationService,
              private route:Router) {
    this.sharedService.school.subscribe((data:any)=>{
      this.school = data;
    });
    this.token = this.sharedService.getToken();
    console.log("in const auth"+this.token);
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
          let tkn= this.sharedService.getToken();
          this.token=  tkn!=null?tkn:'';

          if((this.token === '') && !request.url.includes("authenticate")){
            this.route.navigateByUrl('/login');
          }
          const headers  = request.headers.set('school',String(this.school.id)).set('Authorization',this.token);
          if(this.school.id!=0||request.url.includes("school")||request.url.includes("authenticate")){
            let outRequest = request.clone({headers:headers})
            return next.handle(outRequest);
        }
        
      } catch (error) {
        console.log(error);
    }
    
  }
}
