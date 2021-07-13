import { Injectable , Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class LoopbackService {

  private url: string;
  private limit: number = 20;
  private limitLookUps: number = 100;
  private cookiesIndex: string = 'logged_in';
  private token: string = undefined;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.url = this.configService.endPoint;
  }

  /**
   * Deprecated
   */
  getToken(): string {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      return JSON.parse(localStorage.getItem('User')).token;
    }
  }

  /**
   * Deprecated
   */
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

  _getToken(field: string = 'token'): string {
    if (this.cookieService.check(this.cookiesIndex)){
      if(this.token) return this.token;
      let cookies: object = JSON.parse(this.cookieService.get(this.cookiesIndex));
      this.token = cookies[field];
      return cookies[field];
    } else return ''
  }

  getAllRequest(tableName: string, searchText: string, attributeSelected: string, applySearchBy: boolean = false, offset: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    let query: string;

    if (applySearchBy) {
      const regexp = `/${searchText}/i`;
      query = `{"where":{"and":[{"SACAP__UUID__c":{"nlike":"null"}},{"${attributeSelected}":{"regexp":"${regexp}"}}]},"order":"${attributeSelected}","limit":${this.limit},"offset":${offset}}`;
    } else {
      query = `{"where":{"SACAP__UUID__c": {"nlike": "null" }},"order":"${attributeSelected}","limit":${this.limit},"offset":${offset}}`;
    }
    return this.http.get(`${this.url}/${tableName}?filter=${query}`, httpOptions);
  }

  getTotalItems(tableName: string, searchText: string, attributeSelected: string, applySearchBy: boolean = false) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    let query: string;
    if (applySearchBy) {
      const regexp = `/${searchText}/i`;
      query = `where={"and":[{"SACAP__UUID__c":{"nlike":"null"}},{"${attributeSelected}":{"regexp":"${regexp}"}}]}`;
    } else {
      query = `where={"SACAP__UUID__c":{"nlike":"null"}}`;
    }
    return this.http.get(`${this.url}/${tableName}/count?${query}`, httpOptions)
      .pipe(map( (data: any) => {
          return data.count;
        })
      );
  }

  getLookUp(tableName: string, query: {}) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/?filter=${JSON.stringify(query)}`, httpOptions);
  }

  getLookUpBySearch(tableName: string, text: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    const regexp = `/${text}/i`;
    const query = {where:
      {
        and:[
          {SACAP__UUID__c:{nlike:"null"}},
          {Name:{regexp:`${regexp}`}}
        ]
      },
      order:"Name",
      limit:this.limitLookUps
    }
    return this.http.get(`${this.url}/${tableName}?filter=${JSON.stringify(query)}`, httpOptions);
  }

  getLookUpBySearchWithoutName(tableName: string, text: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    const regexp = `/${text}/i`;
    const query = {where:
      {
        and:[
          {SACAP__UUID__c:{nlike:"null"}},
        ],
        or:[
          {FirstName:{regexp:`${regexp}`}},
          {LastName:{regexp:`${regexp}`}}
        ]
      },
      order:"FirstName",
      limit:this.limitLookUps
    }
    return this.http.get(`${this.url}/${tableName}?filter=${JSON.stringify(query)}`, httpOptions);
  }

  getWithFilter(query: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.get(`${this.url}/${query}`, httpOptions);
  }

  getRecordWithFindOne(tableName: string, uuid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/${uuid}`, httpOptions);
  }

  getRecordRequest(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/${id}`, httpOptions);
  }

  postRequest(tableName: string, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.post(`${this.url}/${tableName}`, body, httpOptions);
  }

  patchRequest(tableName: string, id: number, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.put(`${this.url}/${tableName}/${id}`, body, httpOptions);
  }

  deleteItem(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`
      })
    };
    return this.http.delete(`${this.url}/${tableName}/${id}`, httpOptions);
  }
}
