import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {of} from 'rxjs';


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
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
          let tkn= this.sharedService.getToken();
          this.token=  tkn!=null?tkn:'';
          
          let storedSchool =this.sharedService.getSchool();
          console.log(storedSchool+"-----stored school")
          this.school= storedSchool!=null?storedSchool:{id:0};

          if((this.token === '') && !request.url.includes("authenticate")){
            this.route.navigateByUrl('/login');
          }

          console.log(request.url+'-----------------'+this.school.id);
          const headers  = request.headers.set('school',String(this.school.id)).set('Authorization',this.token);
          if(this.school.id!=0||request.url.includes("school")||request.url.includes("authenticate")){
            let outRequest = request.clone({headers:headers})
            return next.handle(outRequest)
        }else{
          return of(new HttpResponse({
            status:200
          }));
        }
        
      } catch (error) { 
        console.log(error);
    } 
    
  }
}
