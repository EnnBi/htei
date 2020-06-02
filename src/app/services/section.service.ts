import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';
import { Section } from '../components/section/section.component';
import { Observable } from 'rxjs';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http:HttpClient,private url:UrlService) { }

  fetchAllSections(){
      const options={
        url:this.url.SECTIONS,
      }
      return this.http.get(this.url.SECTIONS);
  }

  saveSection(data):Observable<Section>{
     return this.http.post<Section>(this.url.SECTIONS,data).pipe(map(response=>{
            return response;
      }));      
  }

  fetchOne(id){
      return this.http.get<Section>(this.url.SECTIONS+id);
  }

  deleteOne(id){
    const url = this.url.SECTION_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }

  fetchSectionOnClassId(id){
    const req_url=this.url.CLASSES+id+"/sections";
    return this.http.get(req_url);
  }

  fetchSectionsOfTeacherOnClassId(id){
    const req_url = this.url.SECTIONS+"class/"+id;
    return this.http.get(req_url);
  }
}
