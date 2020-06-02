import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient,private url:UrlService) { }


  fetchAll(){
      return this.http.get(this.url.STUDENTS);
  }

  save(data){
     return this.http.post(this.url.STUDENTS,data,{'observe':'response'}).pipe(map(response=>{
            return response;
      }));      
  }

  /* fetchOne(id){
      return this.http.get<Student>(this.url.CLASSES+id);
  } */

  deleteOne(id){
    const url = this.url.STUDENT_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }
}
 