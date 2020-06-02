import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http:HttpClient,private url:UrlService) { }

  fetchAll(){
      return this.http.get(this.url.SUBJECTS);
  }
  
  save(data){
    return this.http.post(this.url.SUBJECTS,data,{'observe':'response'}).pipe(map(response=>{
           return response;
     }));      
  }
  
  deleteOne(id){
    const url = this.url.SUBJECT_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }

  fetchSubjectsOnClassIdAndSectionId(cid,sid){
      const url = this.url.SUBJECTS+"class/"+cid+"/section/"+sid;
      return this.http.get(url);

  }

  fetchSubjectsOnClassId(id){
    const req_url = this.url.SUBJECTS+"/class/"+id
    return this.http.get(req_url);
  }
}
