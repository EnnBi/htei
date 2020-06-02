import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { Class } from '../components/class/class.component';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http:HttpClient,private url:UrlService) { }


  fetchAll(){
      return this.http.get(this.url.CLASSES);
  }

  fetchPaged(page){
    return this.http.get(this.url.CLASSES_PAGED+page);
}

  save(data){
     return this.http.post(this.url.CLASSES,data,{'observe':'response'}).pipe(map(response=>{
            return response;
      }));      
  }

  fetchOne(id){
      return this.http.get<Class>(this.url.CLASSES+id);
  }

  deleteOne(id){
    const url = this.url.CLASS_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }

  fetchClassesOfSchool(){
    const url = this.url.CLASSES+"school"
    return this.http.get(url);
  }
}
