import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UrlService } from './url.service';
import {map,catchError} from 'rxjs/operators';
import { of }from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient,private url:UrlService,private storage:StorageMap) { }

   authenticate(data):Observable<String>{
     
    return this.http.post(this.url.AUTHENTICATE,data,{'observe': 'response'}).pipe(map((response:any)=>{
        localStorage.setItem('token',response.body['token']);
        localStorage.setItem('roles',response.body['role']);
        return response.status;
    })).pipe(catchError(err=>{
        return of(err.status);
    }));  

   }

   logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
   }
}
