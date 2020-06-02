import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExamDateService {

  constructor(private http:HttpClient,private url:UrlService) { }

  fetchOnClassAndSectionAndTerm(cid,sid,tid){
    const req_url=this.url.EXAMDATE+"class/"+cid+"/section/"+sid+"/term/"+tid;
    return this.http.get(req_url);
  }

  save(data){
    return this.http.post(this.url.EXAMDATE,data,{'observe':'response'}).pipe(map(response=>{
           return response;
     }));      
  }

  deleteOne(id){
    const url = this.url.EXAMDATE_DELETE+id;
     return this.http.get(url,{'observe':'response'});
  }
}
