import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  school = new BehaviorSubject<any>(1);//Subject<any>();

  constructor(private storage:StorageMap) { }

  getToken(){
   return localStorage.getItem('token');
  }

  getSchool(){
    return JSON.parse(localStorage.getItem('school'));
  }

  getSchools(){
    return JSON.parse(localStorage.getItem('schools'));
  }

}
