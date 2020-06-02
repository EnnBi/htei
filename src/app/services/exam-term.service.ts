import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExamTermService {

  constructor(private http:HttpClient,private url:UrlService) { }

  fetchAll(){
      return this.http.get(this.url.EXAMTERMS);
  }
  
  save(data){
    return this.http.post(this.url.EXAMTERMS,data,{'observe':'response'}).pipe(map(response=>{
           return response;
     }));      
  }
  
  deleteOne(id){
    const url = this.url.EXAMTERM_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }
}
