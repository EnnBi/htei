import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectTeacherService {

  constructor(private http:HttpClient,private url:UrlService) { }


  fetchonClassAndSection(classId,secId){
      var req_url= this.url.CST+"class/"+classId+"/section/"+secId;
      return this.http.get(req_url);
  }

  save(data){
     return this.http.post(this.url.CST,data,{'observe':'response'}).pipe(map(response=>{
            return response;
      }));      
  }

  deleteOne(id){
    const url = this.url.CST_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }
}
