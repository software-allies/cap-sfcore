import { Component, OnInit, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoopbackService } from '../../services/loopback.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-sf',
  template: `
  <div class="container">
    <div class="row">
      <div class="col-lg-12 mx-auto">
      <div class="page-header">
        <div class="row">

          <div class="col-md-3 mb-2">
            <a routerLink="/{{objectComponent}}/create" class="btn btn-outline-dark pull-right">
              Add New {{objectComponent | titlecase}}
            </a>
          </div>

          <div class="col-md-9">
            <div class="form-row">

            <!--
              <div class="col-md-3 mb-2">
                <select class="custom-select" [(ngModel)]="selectAttribute">
                  <option *ngFor="let search of object.search; let i = index" value="{{search}}">{{search}}</option>
                </select>
              </div>
            -->

              <div class="input-group input-border col-md-12 mb-2">
                <input
                  type="text"
                  id="search"
                  name="search"
                  [(ngModel)]="searchAttribute" class="form-control"
                  (keyup.enter)="searchAttribute === '' ? '' :searchBy()"
                >

                <div class="input-group-append" *ngIf="searchByText">
                  <button title="Clear Filter" (click)="everythingRecords()" class="btn btn-outline-dark" type="button" >
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                      <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                    </svg>
                  </button>
                </div>

                <div class="input-group-append">
                  <button
                    (click)="searchBy()"
                    class="btn btn-outline-dark"
                    type="button"
                    [disabled]="searchAttribute === ''">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                      <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
        <table *ngIf="listings.length && !listings404" class="table table-borderless table-hover rwd_auto mt-3">
          <thead class="thead-dark">
            <tr *ngIf="objectComponent === 'account'">
              <th scope="col">Account Name</th>
              <th scope="col" class="discard">Billing City</th>
              <th scope="col" class="discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'contact'">
              <th scope="col">Name</th>
              <th scope="col" class="discard">Account Name</th>
              <th scope="col" class="discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'opportunity'">
              <th scope="col">Opportunity Name</th>
              <th scope="col" class="discard">Account Name</th>
              <th scope="col" class="discard">Close Date</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'lead'">
              <th scope="col">Name</th>
              <th scope="col" class="discard">Company</th>
              <th scope="col" class="discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let object of listings | paginate: { id: 'pagination', itemsPerPage: totalListings, currentPage: currentPage, totalItems: totalItems}">

              <td *ngIf="objectComponent === 'account'" scope="row">
                <a routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.Name }}</a>
              </td>
              <td *ngIf="objectComponent === 'account'" class="discard">{{ object.BillingCity }}</td>
              <td *ngIf="objectComponent === 'account'" class="numeric discard">{{ object.Phone }}</td>

              <td *ngIf="objectComponent === 'contact'" scope="row">
                <a routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.FirstName }} {{ object.LastName }}</a>
              </td>
              <td *ngIf="objectComponent === 'contact'" class="discard">
                <a routerLink="/account/{{object.accountSACAP__UUID__c}}">{{ object.accountName }}</a>
              </td>
              <td *ngIf="objectComponent === 'contact'" class="numeric discard">{{ object.MobilePhone }}</td>

              <td *ngIf="objectComponent === 'opportunity'" scope="row">
                <a routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.Name }}</a>
              </td>
              <td *ngIf="objectComponent === 'opportunity'" class="discard">
                <a routerLink="/account/{{object.accountSACAP__UUID__c}}">{{ object.accountName }}</a>
              </td>
              <td *ngIf="objectComponent === 'opportunity'" class="date discard">{{ object.CloseDate | date: 'MM/dd/yyyy' : 'UTC/GMT'}}</td>

              <td *ngIf="objectComponent === 'lead'"  scope="row">
                <a routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.FirstName }} {{ object.LastName }}</a>
              </td>
              <td *ngIf="objectComponent === 'lead'" class="discard">{{ object.Company }}</td>
              <td *ngIf="objectComponent === 'lead'" class="numeric discard">{{ object.Phone }}</td>

              <td class="text-center">
                <div class="dropdown">
                  <button
                    class="btn btn-dark btn-sm dropdown-toggle"
                    type="button"
                    id="actions"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fa fa-ellipsis-h"></i>
                  </button>
                  <div class="dropdown-menu" aria-labelledby="actions">
                    <button class="dropdown-item" type="button" routerLink="/{{objectComponent}}/{{ object.SACAP__UUID__c }}">View</button>
                    <button class="dropdown-item" type="button" routerLink="/{{objectComponent}}/{{ object.SACAP__UUID__c }}/update">Update</button>
                    <button class="dropdown-item" type="button" (click)="deleteItem(object.id)">Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination" *ngIf="totalItems && currentPage && totalItems > totalListings">
      <app-pagination #PaginationComponentChild (pageChange)="actionPage($event)"></app-pagination>
    </div>

    <div  *ngIf="!listings.length && listings404" class="card text-center mt-3">
      <div class="card-body">
        <h5 class="card-title">No Results found!</h5>
        <p class="card-text">
          Sorry, but nothing matched your search terms. Please try again with some different keywords.
        </p>
      </div>
    </div>

  </div>

  `,
  styles: [`

  div.input-border input {
    border-color: #343a40;
  }

  div.input-border input:focus {
    outline:none !important;
    outline-width: 0 !important;
    box-shadow: none !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    border-color: #343a40;
    // border-width: 1.5px;
  }

  table {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    border-collapse: collapse;
  }

  table.rwd_auto {width: 100%; margin: 0 0 50px 0; }
  .rwd_auto th {word-wrap: break-word; padding:5px; text-align: left; }
  .rwd_auto th:last-child {text-align: center; }

  .rwd_auto td {word-wrap: break-word; border-bottom: .5px solid #ccc; padding: 5px; text-align: left; }
  .rwd_auto td.numeric { text-align: left; }
  .rwd_auto td.date { text-align: left; }
  .rwd_auto tr:last-child td { border:0; }


	/* Mobile ----------- */
	@media (max-width: 767px) {
    .rwd_auto th.discard, .rwd_auto td.discard { display: none !important; }
  }

  .ngx-pagination {
    padding: 0 !important;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-right: 3rem;
  }

  a{
    color: #000;
  }

  td{
    text-align: left;
  }
  `]
})
export class IndexComponent implements OnInit {

  @ViewChild('PaginationComponentChild', { static: true }) paginationComponent: PaginationComponent;
  @Output('setTitle') objectComponentTitle: EventEmitter<string> = new EventEmitter();

  object: any;
  objectAPI: string;
  objectComponent: string;
  objects = [
    {
      object: 'account',
      api: 'Accounts',
      search: [
        'Name',
      ]
    },
    {
      object: 'contact',
      api: 'Contacts',
      search: [
        'Name',
      ]
    },
    {
      object: 'lead',
      api: 'Leads',
      search: [
        'Name',
      ]
    },
    {
      object: 'opportunity',
      api: 'Opportunities',
      search: [
        'Name',
      ]
    }
  ];

  currentPage: number;
  skipFilter: number;
  totalItems: number;

  listings: any;
  totalListings = 20;
  listings404: boolean;

  searchAttribute: string;
  selectAttribute: string;
  searchByText: boolean;

  constructor(
    private loopBackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
    this.listings = [];
    this.listings404 = false;
    this.skipFilter = 0;
    this.totalItems = null;
    this.objectAPI = null;
    this.objectComponent = null;
    this.objectComponentTitle.emit('');
    this.searchAttribute = '';
    this.selectAttribute = '';
    this.searchByText = false;
  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(queryParams => {
      this.resetFilters();
      this.ApplyQueryParams(queryParams);
    });

    this.activateRoute.params.subscribe(params => {
      this.resetSearch(this.activateRoute.snapshot.queryParams.Search === 'true' ? true : false);
      this.object = this.objects.find(x => x.object === params.object);
      this.objectAPI = this.object.api;
      this.objectComponent = this.object.object;
      this.selectAttribute = this.object.search[0];
      this.objectComponentTitle.emit(this.object.object);
      this.search();
    });
  }

  resetFilters() {
    this.listings = [];
    this.skipFilter = 0;
    this.currentPage = 1;
    this.listings404 = false;
    // this.searchByText = false;
  }

  resetFiltersByFindOne() {
    this.listings = [];
    this.skipFilter = 0;
    this.currentPage = 1;
    this.totalItems = null;
    this.listings404 = false;
  }

  resetSearch(valid: boolean) {
    if (valid) {
      this.listings404 = false;
      this.searchByText = this.searchByText ? true : false;
      this.searchAttribute = this.searchByText ? this.searchAttribute : '';
    } else {
      this.listings404 = false;
      this.searchByText = false;
      this.searchAttribute = '';
    }
  }

  search() {
    this.loopBackService.getAllRequest(
      this.objectAPI,
      this.searchAttribute,
      this.selectAttribute,
      this.searchByText,
      this.skipFilter
    ).subscribe((res: any) => {
      this.listings = res;
      console.log(res,'res');
      this.listings404 = res.length < 1 ? true : false;
      if (this.objectAPI === 'Contacts' || this.objectAPI === 'Opportunities') {
        let sfIds = [];
        for (let index in res) {
          sfIds.push({ SfId: res[index].AccountId });
        }
        sfIds = sfIds.filter(id => id.SfId !== null);
        const query = `Accounts?filter={"where":{"or":${JSON.stringify(
          sfIds
        )}},"fields":{"SACAP__UUID__c":true,"id":true,"SfId":true,"AccountNumber":true,"Name":true}}`;
        if (sfIds.length) {
          this.loopBackService
          .getWithFilter(query)
          .subscribe((accounts: Array<any>) => {
            this.listings.forEach((item, index) => {
              let account = accounts.filter(account => account.SfId === item.AccountId)
              if (account[0] !== undefined) {
                this.listings[index].accountName = account[0].Name;
                this.listings[index].accountSACAP__UUID__c = account[0].SACAP__UUID__c;
                // this.listings[index].accountName = accounts.filter(account => account.SfId === item.AccountId)[0].Name;
              }
            });
          });
        }
      }
    }, (error: any) => {
      this.listings404 = true;
      console.log(error.status + ' - ' + error.statusText);
    });
    this.loopBackService.getTotalItems(
      this.objectAPI,
      this.searchAttribute,
      this.selectAttribute,
      this.searchByText
    ).subscribe(totalitmes => {
      this.totalItems = totalitmes;
    });
  }

  searchBy() {
    if (this.searchAttribute) {
      this.searchByText = true;
      this.resetFiltersByFindOne();
      this.search();
      this.setQueryParams(this.searchAttribute);
    }
  }

  everythingRecords() {
    this.resetSearch(false);
    this.QueryParamsReset();
    this.searchByText = false;
    this.search();
  }

  deleteItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(result => {
      if (result.value) {
        this.listings = this.listings.filter(acc => acc.id !== id);
        this.loopBackService.deleteItem(this.objectAPI, id).subscribe(res => {
          Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
          this.loopBackService.getTotalItems(
            this.objectAPI,
            this.searchAttribute,
            this.selectAttribute,
            this.searchByText
          ).subscribe(totalitmes => {
            this.totalItems = totalitmes;
            if (totalitmes <= 20) {
              this.actionPage(1);
            }
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }

  ApplyQueryParams(queryParams) {
    if (queryParams && queryParams.Page) {
      this.currentPage = Number(queryParams.Page);
      this.skipFilter = (this.currentPage - 1) * 20;
    } else {
      this.currentPage = 1;
    }
    if (queryParams && queryParams.SearchText && queryParams.Search) {
      this.searchAttribute = queryParams.SearchText;
      this.searchByText = queryParams.Search;
    }
  }

  actionPage(page: number) {
    this.currentPage = page;
    this.skipFilter = this.currentPage > 1 ? (this.currentPage - 1) * 20 : null;
    const pageQueryParam = this.currentPage === 1 ? null : this.currentPage;
    this.search();
    const navigationExtras: NavigationExtras = {
      queryParams: { Page: pageQueryParam },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([`${this.objectComponent}`], navigationExtras);
    this.skipFilter = null;
  }

  QueryParamsReset() {
    const navigationExtras: NavigationExtras = {
      queryParams: { Page: null, SearchText: null, Search: null },
    };
    this.router.navigate([`${this.objectComponent}`], navigationExtras);
  }

  setQueryParams(searchTextParam: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { SearchText: searchTextParam, Search: true, Page: null },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([`${this.objectComponent}`], navigationExtras);
  }
}
