import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  school = new Subject();

  constructor(private storage:StorageMap) { }

  getToken(){
   return localStorage.getItem('token');
  }
}
