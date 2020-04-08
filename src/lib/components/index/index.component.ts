import { Component, OnInit, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { LoopbackService } from '../../services/loopback.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-sf',
  template: `

  <div class="container">
    <div class="row">
      <div class="col-lg-12 mx-auto">
        <div class="page-header clearfix">
          <h2 class="pull-left">{{objectAPI}}</h2>
          <a routerLink="/{{objectComponent}}/create" class="btn btn-success pull-right"
            >Add New {{objectComponent | titlecase}}</a>
        </div>
        <table class="table table-striped table-condensed mt-3 rwd_auto">
          <thead>
            <tr *ngIf="objectComponent === 'account'">
              <th scope="col">Account Name</th>
              <th scope="col">Billing City</th>
              <th scope="col discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'contact'">
              <th scope="col">Name</th>
              <th scope="col">Account Name</th>
              <th scope="col discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'opportunity'">
              <th scope="col">Opportunity Name</th>
              <th scope="col">Account Name</th>
              <th scope="col discard">Close Date</th>
              <th scope="col">Actions</th>
            </tr>
            <tr *ngIf="objectComponent === 'lead'">
              <th scope="col">Name</th>
              <th scope="col">Company</th>
              <th scope="col discard">Phone</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let object of listings | paginate: { id: 'pagination', itemsPerPage: 20, currentPage: currentPage, totalItems: totalItems}">
              <td *ngIf="objectComponent === 'account' || objectComponent === 'opportunity'" >{{ object.Name }}</td>
              <td *ngIf="objectComponent === 'contact' || objectComponent === 'lead' " >{{ object.FirstName }} {{object.LastName}}</td>
              <!-- <td *ngIf="objectComponent === 'opportunity' " >{{ object.Name }}</td> -->
              <!-- <td *ngIf="objectComponent === 'lead' " >{{ object.FirstName }}</td> -->

              <td *ngIf="objectComponent === 'account' " >{{ object.BillingCity }}</td>
              <td *ngIf="objectComponent === 'contact' || objectComponent === 'opportunity' " >{{ object.accountName }}</td>
              <td *ngIf="objectComponent === 'lead' " >{{ object.Company }}</td>
              <!-- <td *ngIf="objectComponent === 'opportunity' " >{{ object.AccountId }}</td> -->

              <td *ngIf="objectComponent === 'account' || objectComponent === 'lead'  " >{{ object.Phone }}</td>
              <td *ngIf="objectComponent === 'contact' " >{{ object.MobilePhone }}</td>
              <td *ngIf="objectComponent === 'opportunity' " >{{ object.CloseDate | date: 'MM/dd/yyyy'}}</td>
              <!-- <td *ngIf="objectComponent === 'lead' " >{{ object.Phone }}</td> -->
              <td>
                <div class="dropdown">
                  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="actions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-ellipsis-h"></i>
                  </button>
                  <div class="dropdown-menu" aria-labelledby="actions">
                    <button class="dropdown-item" type="button" routerLink="/{{objectComponent}}/{{ object.SfId }}">Update</button>
                    <button class="dropdown-item" type="button" (click)="deleteItem(object.id)">Delete</button>
                    <button class="dropdown-item" type="button" routerLink="/{{objectComponent}}/{{ object.SfId }}">View</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div *ngIf="totalItems > 20">
    <app-pagination #PaginationComponentChild (pageChange)="actionPage($event)"></app-pagination>
  </div>
  `,
  styles: [`

	table.rwd_auto { border:1px solid #ccc;width:100%;margin:0 0 50px 0; }
  .rwd_auto th { background:#ccc;padding:5px;text-align:center; }
  .rwd_auto td { border-bottom:1px solid #ccc;padding:5px;text-align:center; }
  .rwd_auto tr:last-child td { border:0; }
	.rwd_auto th, .rwd_auto td { white-space: nowrap; }
	
  @media only screen and (max-width: 760px), (min-width: 768px) and (max-width: 1024px)  
	{
		.discard { display:none; }
	}
	
	/* Smartphones (portrait and landscape) ----------- */
	@media only screen and (min-width : 320px) and (max-width : 480px) 
	{
		.discard { display:none; }
	}
	
	/* iPads (portrait and landscape) ----------- */
	@media only screen and (min-width: 768px) and (max-width: 1024px) 
	{
		.discard { display:none; }
	}

	/* Mobile ----------- */
	@media (max-width: 767px) {
		.discard { display:none; }
  }


  `]
})
export class IndexComponent implements OnInit {

  @ViewChild('PaginationComponentChild', { static: true }) paginationComponent: PaginationComponent;
  listings: any;
  currentPage: number;
  skipFilter: number;

  @Output('setTitle') objectComponentTitle: EventEmitter<string> = new EventEmitter();
  
  object: any;
  objectAPI: string;
  objectComponent: string;
  objects = [
    { object: 'account', api: 'Accounts' },
    { object: 'contact', api: 'Contacts' },
    { object: 'lead', api: 'Leads' },
    { object: 'opportunity', api: 'Opportunitys' }
  ];
  totalItems: number;

  constructor(
    private loopBackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
    this.listings = [];
    this.skipFilter = 0;
    this.totalItems = null;
    this.objectAPI = null;
    this.objectComponent = null;
    this.objectComponentTitle.emit('');
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.object = this.objects.find(x => x.object === params.object);
      this.objectAPI = this.object.api;
      this.objectComponent = this.object.object;

      this.objectComponentTitle.emit(this.object.object);

      this.skipFilter = 0;
      this.search(this.objectAPI);
    });
    this.activateRoute.queryParams.subscribe(queryParams => {
      this.ApplyQueryParams(queryParams);
    });
  }

  search(object: string) {
    this.loopBackService.getAllRequest(object, this.skipFilter).subscribe(res => {
      this.listings = res;
      if (object === 'Contacts' || object === 'Opportunitys') {
        let sfIds = [];
        for (let index in res) {
          sfIds.push({ SfId: res[index].AccountId });
        }
        sfIds = sfIds.filter(id => id.SfId !== null);
        const query = `/Accounts?filter={"where":{"or":${JSON.stringify(
          sfIds
        )}}}`;
        this.loopBackService
          .getWithFilter(query)
          .subscribe((accounts: Array<any>) => {
            this.listings.forEach((item, index) => {
              this.listings[index].accountName = accounts.filter(
                account => account.SfId === item.AccountId
              )[0].Name;
            });
          });
      }
    });
    this.loopBackService.getTotalItems(object).subscribe(totalitmes => {
      this.totalItems = totalitmes;
    });
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
          this.loopBackService.getTotalItems(this.objectAPI).subscribe(totalitmes => {
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
    // this.currentPage =queryParams && queryParams.Page ? Number(queryParams.Page) : 1;
  }

  actionPage(page: number) {
    this.currentPage = page;
    this.skipFilter = this.currentPage > 1 ? (this.currentPage - 1) * 20 : null;
    const pageQueryParam = this.currentPage === 1 ? null : this.currentPage;
    this.search(this.objectAPI);
    const navigationExtras: NavigationExtras = {
      queryParams: { Page: pageQueryParam },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([`${this.objectComponent}`], navigationExtras);
    this.skipFilter = null;
  }
}
