import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import {map} from 'rxjs/operators';
import { Paper } from '../components/paper/paper.component';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(private http:HttpClient,private url:UrlService) { }


  fetchAll(){
      return this.http.get(this.url.PAPER);
  }

  save(data){
     return this.http.post(this.url.PAPER,data,{'observe':'response'}).pipe(map(response=>{
            return response;
      }));      
  }

  fetchOne(id){
      return this.http.get<Paper>(this.url.CLASSES+id);
  }

  deleteOne(id){
    const url = this.url.CLASS_DELETE+id;
    return this.http.get(url,{'observe':'response'});
  }

  deleteQuestionOfPaper(questionId){
      const req_url=this.url.QUESTION_DELETE+questionId;
      return this.http.get(this.url.PAPER);
  }

  fetchQuestionsOfPaper(id){
    const req_url=this.url.QUESTIONS_OF_PAPER+id;
    return this.http.get(req_url);
  }
  fetchPapersOfClassSectionTerm(cid,sid,tid){
    const req_url=this.url.PAPER+"class/"+cid+"/section/"+sid+"/term/"+tid;
    return this.http.get(req_url);
  }
}
