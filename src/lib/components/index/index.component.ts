import { Component, OnInit, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoopbackService } from '../../services/loopback.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-sf',
  template: `
<div class="section-table">
  <div class="container-action">
    <h2 class="heading-secondary--light u-text-uppercase u-center-text u-margin-bottom-big">{{objectComponent | titlecase}}</h2>
    <div class="container-search">
      <a routerLink="/{{objectComponent}}/create" class="btns btns--blue u-position-button-input-right">Add new {{objectComponent | titlecase}}</a>
      <div class="container-input">
        <input
          name="search"
          type="text"
          class="form__input u-shadow-small u-margin-input"
          id="search"
          name="search"
          placeholder="Search {{objectComponent}}"
          [(ngModel)]="searchAttribute"
          (keyup.enter)="searchAttribute === '' ? '' :searchBy()"
          >
        <a (click)="searchBy()" class="btns btns--blue ">
          <i class="bi bi-search"></i>
        </a>
      </div>
    </div>
  </div>
    <div class="container-table">
      <div class="table-container">

        <table *ngIf="listings.length && !listings404" id="table" class="table" cellspacing="0" cellpadding="0">
          <thead class="thead">

            <ng-container *ngIf="objectComponent === 'account'">
              <tr class="head">
                <th scope="col" id="..." class="head__title">Account Name</th>
                <th scope="col" id="..." class="head__title discard">Billing City</th>
                <th scope="col" id="..." class="head__title discard">Phone</th>
                <th scope="col" id="..." class="head__title">Actions</th>
              </tr>
            </ng-container>

            <ng-container *ngIf="objectComponent === 'contact'">
              <tr class="head">
                <th scope="col" id="..." class="head__title">Name</th>
                <th scope="col" id="..." class="head__title discard">Account Name</th>
                <th scope="col" id="..." class="head__title discard">Phone</th>
                <th scope="col" id="..." class="head__title">Actions</th>
              </tr>
            </ng-container>

            <ng-container *ngIf="objectComponent === 'opportunity'">
              <tr class="head">
                <th scope="col" id="..." class="head__title">Opportunity Name</th>
                <th scope="col" id="..." class="head__title discard">Account Name</th>
                <th scope="col" id="..." class="head__title discard">Close Date</th>
                <th scope="col" id="..." class="head__title">Actions</th>
              </tr>
            </ng-container>

            <ng-container *ngIf="objectComponent === 'lead'">
              <tr class="head">
                <th scope="col" id="..." class="head__title">Name</th>
                <th scope="col" id="..." class="head__title discard">Companye</th>
                <th scope="col" id="..." class="head__title discard">Phone</th>
                <th scope="col" id="..." class="head__title">Actions</th>
              </tr>
            </ng-container>
          </thead>
          <tbody>
            <tr class="tbody" *ngFor="let object of listings | paginate: { id: 'pagination', itemsPerPage: totalListings, currentPage: currentPage, totalItems: totalItems}">

              <ng-container *ngIf="objectComponent === 'account'">
                <th scope="col" id="..." class="tbody__content">
                  <a class="tbody__content--link" routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.Name }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.BillingCity }}</th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.Phone }}</th>
              </ng-container>

              <ng-container *ngIf="objectComponent === 'contact'">
                <th scope="col" id="..." class="tbody__content">
                  <a class="tbody__content--link" routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.FirstName }} {{ object.LastName }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">
                  <a class="tbody__content--link" routerLink="/account/{{object.accountSACAP__UUID__c}}">{{ object.FirstName }} {{ object.LastName }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.MobilePhone }}</th>
              </ng-container>

              <ng-container *ngIf="objectComponent === 'opportunity'">
                <th scope="col" id="..." class="tbody__content">
                  <a class="tbody__content--link" routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.Name }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">
                  <a class="tbody__content--link" routerLink="/account/{{object.accountSACAP__UUID__c}}">{{ object.accountName }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.CloseDate | date: 'MM/dd/yyyy' : 'UTC/GMT'}}</th>
              </ng-container>


              <ng-container *ngIf="objectComponent === 'lead'">
                <th scope="col" id="..." class="tbody__content">
                  <a class="tbody__content--link" routerLink="/{{objectComponent}}/{{object.SACAP__UUID__c}}">{{ object.FirstName }} {{ object.LastName }}</a>
                </th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.Company }}</th>
                <th scope="col" id="..." class="tbody__content discard">{{ object.Phone }}</th>
              </ng-container>

              <th scope="col" id="..." class="tbody__content">
                <div class="dropdown">
                  <a
                    class="btns btns-secondary dropdown-toggle"
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item" routerLink="/{{objectComponent}}/{{ object.SACAP__UUID__c }}">View</a></li>
                    <li><a class="dropdown-item" routerLink="/{{objectComponent}}/{{ object.SACAP__UUID__c }}/update">Update</a></li>
                    <li><a class="dropdown-item" (click)="deleteItem(object.SACAP__UUID__c)">Delete</a></li>
                  </ul>
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div  *ngIf="!listings.length && listings404" class="card text-center mt-3">
        <div class="card-body">
          <h5 class="card-title">No Results found!</h5>
          <p class="card-text">
            Sorry, but nothing matched your search terms. Please try again with some different keywords.
          </p>
        </div>
      </div>
      <div class="pagination" *ngIf="totalItems && currentPage && totalItems > totalListings">
        <app-pagination #PaginationComponentChild (pageChange)="actionPage($event)"></app-pagination>
      </div>
    </div>
  </div>
  `,
  styles: [`
  @media (max-width: 767px) {
    .table th.discard, .table td.discard { display: none !important; }
  }
  .ngx-pagination {
    padding: 0 !important;
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top:4rem;
    margin-bottom:4rem ;
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
        'FirstName',
      ]
    },
    {
      object: 'lead',
      api: 'Leads',
      search: [
        'FirstName',
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
      this.listings404 = res.length < 1 ? true : false;
      if (this.objectAPI === 'Contacts' || this.objectAPI === 'Opportunities') {
        let lookUps = [];
        for (let index in res) {
          lookUps.push({ SACAP__UUID__c: res[index].Account__SACAP__UUID__c });
        }
        lookUps = lookUps.filter(id => id.SACAP__UUID__c !== null);
        const query = `Accounts?filter={"where":{"or":${JSON.stringify(
          lookUps
        )}},"fields":{"SACAP__UUID__c":true,"id":true,"AccountNumber":true,"Name":true}}`;
        if (lookUps.length) {
          this.loopBackService
          .getWithFilter(query)
          .subscribe((accounts: Array<any>) => {
            this.listings.forEach((item, index) => {
              let account = accounts.filter(account => account.SACAP__UUID__c === item.Account__SACAP__UUID__c)
              if (account[0] !== undefined) {
                this.listings[index].accountName = account[0].Name;
                this.listings[index].accountSACAP__UUID__c = account[0].SACAP__UUID__c;
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
    if (this.objectComponent === 'account') {
      this.loopBackService.getLookUp('Opportunities',{where:{Account__SACAP__UUID__c:id}}).subscribe({
        next: (opportunities: any[]) => {
          if (opportunities.length>0) {
            Swal.fire('Denied', 'The record you want to delete has a record of type Opportunity linked', 'error');
          } else {
            Swal.fire({
              title: 'Are you sure?',
              text: 'You will not be able to recover this record!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, keep it'
            }).then(result => {
              if (result.value) {
                this.listings = this.listings.filter(acc => acc.SACAP__UUID__c !== id);
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
              };
            });
          }
        },
        error: (error: any) => console.log(error)
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then(result => {
        if (result.value) {
          this.listings = this.listings.filter(acc => acc.SACAP__UUID__c !== id);
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
