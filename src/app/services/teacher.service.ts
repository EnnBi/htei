import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http:HttpClient,private url:UrlService) { }

  fetchAll(){
      return this.http.get(this.url.TEACHERS);
  }
  
  save(data){
    return this.http.post(this.url.TEACHERS,data,{'observe':'response'}).pipe(map(response=>{
           return response;
     }));      
  }
  
  deleteOne(id){
    const url = this.url.TEACHER_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }
}
