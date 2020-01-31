import { Injectable , Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class LoopbackService {

  url: string;
  limit: number;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.url = this.configService.endPoint;
    this.limit = 20;
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      return JSON.parse(localStorage.getItem('User')).token;
    }
  }

  isUserLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      const userStorage = JSON.parse(localStorage.getItem('User'));
      const helper = new JwtHelperService();
      if (!helper.isTokenExpired(userStorage.token)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getAllRequest(tableName: string, offset: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(
      `${this.url}/${tableName}?filter={"where":{"UUID__c": {"nlike": "null" }},"order":"Name","limit":${this.limit},"offset":${offset}}`,
      httpOptions);
  }

  getWithFilter(query: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${query}`, httpOptions);
  }

  getTotalItems(tableName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/count?where={"UUID__c": {"nlike": "null" }}`, httpOptions)
      .pipe(map( (data: any) => {
          return data.count;
        })
      );
  }

  getRecordWithFindOne(tableName: string, sfid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/findOne?filter={"where":{"SfId":"${sfid}"}}`, httpOptions);
  }

  getRecordRequest(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/${id}`, httpOptions);
  }

  postRequest(tableName: string, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.post(`${this.url}/${tableName}`, body, httpOptions);
  }

  patchRequest(tableName: string, id: number, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.patch(`${this.url}/${tableName}/${id}`, body, httpOptions);
  }

  deleteItem(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.delete(`${this.url}/${tableName}/${id}`, httpOptions);
  }
}
