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

  getAllRequest(tableName: string, searchText: string, attributeSelected: string, applySearchBy: boolean = false, offset: number = 0) {
    /*const order = tableName === 'Accounts' || tableName === 'Opportunitys'
      ? 'Name'
      : 'FirstName';*/

    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    let query: string;

    if (applySearchBy) {
      const regexp = `/${searchText}/i`;
      query = `filter={"where":{"and":[{"SACAP__UUID__c":{"nlike":"null"}},{"${attributeSelected}":{"regexp":"${regexp}"}}]},"order":"${attributeSelected}","limit":${this.limit},"offset":${offset}}`;
    } else {
      query = `filter={"where":{"SACAP__UUID__c": {"nlike": "null" }},"order":"${attributeSelected}","limit":${this.limit},"offset":${offset}}`;
    }
    return this.http.get(`${this.url}/${tableName}?${query}`, httpOptions);
  }

  getTotalItems(tableName: string, searchText: string, attributeSelected: string, applySearchBy: boolean = false) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
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

  getLookUp(tableName: string, id: string) {
    /*const order = tableName === 'Accounts' || tableName === 'Opportunitys'
      ? 'Name'
      : 'FirstName';*/

      // findOne?filter={"where":{"SfId":"${sfid}"}}
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(
      `${this.url}/${tableName}/findOne?filter={"where":{"SfId":"${id}"}}`,
      httpOptions);
  }

  getLookUpBySearch(tableName: string, text: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    const regexp = `/${text}/i`;
    return this.http.get(
      `${this.url}/${tableName}?filter={"where":{"and":[{"SACAP__UUID__c":{"nlike": "null"}},{"Name":{"regexp":"${regexp}"}}]},"order":"Name", "limit":100}`,
      httpOptions
    );
  }

  getWithFilter(query: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${query}`, httpOptions);
  }

  getRecordWithFindOne(tableName: string, sfid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/findOne?filter={"where":{"SfId":"${sfid}"}}`, httpOptions);
  }

  getRecordRequest(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.get(`${this.url}/${tableName}/${id}`, httpOptions);
  }

  postRequest(tableName: string, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.post(`${this.url}/${tableName}`, body, httpOptions);
  }

  patchRequest(tableName: string, id: number, body: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.patch(`${this.url}/${tableName}/${id}`, body, httpOptions);
  }

  deleteItem(tableName: string, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      })
    };
    return this.http.delete(`${this.url}/${tableName}/${id}`, httpOptions);
  }
}
