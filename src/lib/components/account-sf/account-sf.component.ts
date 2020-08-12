import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-account-sf',
  templateUrl: './account-sf.component.html',
  styles: [`
  .record-detail {
  }
  table {
    border-collapse: collapse;
    table-layout: fixed;
  }
  table.rwd_auto {
    width: 100%;
  }
  .rwd_auto th {
    text-align: left;
    width: 45%;
    padding-top: .5em;
    padding-bottom: .5em;
    border-bottom:1px solid #dee2e6;
    word-wrap: break-word;
  }
  .rwd_auto td {
    text-align: left;
    padding-top: .5em;
    padding-bottom: .5em;
    padding-left: .5em;
    border-bottom:1px solid #dee2e6;
    word-wrap: break-word;
  }
  .action-button {
    min-width: 100px;
  }

  /* Mobile ----------- */
	@media (max-width: 374px) {
    .rwd_auto {
      width: 100%;
      border-collapse: collapse;
    }
    .rwd_auto th {
      text-align: left;
      width: 45%;
    }

    table.special td{
      padding-left:1.9em !important;
    }
  }

  `]
})
export class AccountSFComponent implements OnInit {

  form: FormGroup;
  isInvalid: boolean;
  typeValues: string[] = [
    'Prospect',
    'Customer - Direct',
    'Customer - Channel',
    'Channel Partner / Reseller',
    'Installation Partner',
    'Technology Partner',
    'Other'
  ];
  industryValues: any[] = [
    { id: 'Agriculture', value: 'Agriculture', text: 'Agriculture' },
    { id: 'Apparel', value: 'Apparel', text: 'Apparel' },
    { id: 'Banking', value: 'Banking', text: 'Banking' },
    { id: 'Biotechnology', value: 'Biotechnology', text: 'Biotechnology' },
    { id: 'Chemicals', value: 'Chemicals', text: 'Chemicals' },
    { id: 'Communications', value: 'Communications', text: 'Communications' },
    { id: 'Construction', value: 'Construction', text: 'Construction' },
    { id: 'Consulting', value: 'Consulting', text: 'Consulting' },
    { id: 'Education', value: 'Education', text: 'Education' },
    { id: 'Electronics', value: 'Electronics', text: 'Electronics' },
    { id: 'Energy', value: 'Energy', text: 'Energy' },
    { id: 'Engineering', value: 'Engineering', text: 'Engineering' },
    { id: 'Entertainment', value: 'Entertainment', text: 'Entertainment' },
    { id: 'Environmental', value: 'Environmental', text: 'Environmental' },
    { id: 'Finance', value: 'Finance', text: 'Finance' },
    { id: 'Food & Beverage', value: 'Food & Beverage', text: 'Food & Beverage' },
    { id: 'Government', value: 'Government', text: 'Government' },
    { id: 'Healthcare', value: 'Healthcare', text: 'Healthcare' },
    { id: 'Hospitality', value: 'Hospitality', text: 'Hospitality' },
    { id: 'Insurance', value: 'Insurance', text: 'Insurance' },
    { id: 'Machinery', value: 'Machinery', text: 'Machinery' },
    { id: 'Manufacturing', value: 'Manufacturing', text: 'Manufacturing' },
    { id: 'Media', value: 'Media', text: 'Media' },
    { id: 'Not For Profit', value: 'Not For Profit', text: 'Not For Profit' },
    { id: 'Recreation', value: 'Recreation', text: 'Recreation' },
    { id: 'Retail', value: 'Retail', text: 'Retail' },
    { id: 'Shipping', value: 'Shipping', text: 'Shipping' },
    { id: 'Technology', value: 'Technology', text: 'Technology' },
    { id: 'Telecommunications', value: 'Telecommunications', text: 'Telecommunications' },
    { id: 'Transportation', value: 'Transportation', text: 'Transportation' },
    { id: 'Utilities', value: 'Utilities', text: 'Utilities' },
    { id: 'Other', value: 'Other', text: 'Other' },

  ];
  ratingValues: string[] = ['Hot', 'Warm', 'Cold'];
  ownershipValues: string[] = ['Public', 'Private', 'Subsidiary', 'Other'];
  customerPriorityValues: string[] = ['High', 'Low', 'Medium'];
  activeValues: string[] = ['Yes', 'No'];
  slaValues: string[] = ['Gold', 'Silver', 'Platinum', 'Bronze'];
  upsellOpportunityValues: string[] = ['Maybe', 'No', 'Yes'];

  createAccount: boolean;
  updateAccount: boolean;
  viewAccount: boolean;
  status: boolean;

  objectAPI: string;
  objectToSend: any;
  account: any;

  lookUpAccounts: any;


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private loopbackService: LoopbackService
  ) {
    this.createAccount = false;
    this.updateAccount = false;
    this.viewAccount = false;
    this.status = false;

    this.account = {};
    this.objectToSend = {};
    this.objectAPI = 'Accounts';
    this.lookUpAccounts = null;
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: { id: string, status?: string }) => {
        this.getObject(params.id);
        this.status = params.status === 'update' ? true : false;
      });
    }
    this.getAccountLookUp();
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
      this.account = object;
      this.viewAccount = object ? true : false;
      if (this.status) {
        this.createForm(object);
      }
    });
  }

  getAccountLookUp() {
    this.loopbackService.getLookUp('Accounts').subscribe((accounts: Array<{ any }>) => {
      this.lookUpAccounts = accounts.map((account: any) => {
        let data = {
          id: account.id,
          sfID: account.SfId,
          name: account.Name
        }
        return data;
      });
    });
  }

  cancelAction(goBack?: boolean) {
    if (goBack) {
      this.router.navigate([`/account`]);
    } else {
      this.viewAccount = true;
      this.createAccount = false;
      this.updateAccount = false;
    }
  }

  changeFormatDate(formatDate: any): string {
    const date = new Date(formatDate);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    return date.getUTCFullYear() + '-' + month + '-' + day;
  }

  LookUpParentAccount(ParentId: string): string {
    return  this.lookUpAccounts && ParentId && this.lookUpAccounts.find(x => x.value === ParentId) ?
            this.lookUpAccounts.find(x => x.value === ParentId).text
            : '';
  }

  createForm(account?: any) {
    if (account) {
      this.form = new FormGroup({
        id: new FormControl(account.id, [Validators.required]),
        uuid__c: new FormControl(account.SACAP__UUID__c, [Validators.required]),
        name: new FormControl(account.Name, [Validators.required]),
        accountNumber: new FormControl(account.AccountNumber),
        parentId: new FormControl(account.ParentId),
        site: new FormControl(account.Site),
        type: new FormControl(account.Type),
        industry: new FormControl(account.Industry),
        annualRevenue: new FormControl(account.AnnualRevenue, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        rating: new FormControl(account.Rating),
        phone: new FormControl(account.Phone),
        fax: new FormControl(account.Fax),
        website: new FormControl(account.Website),
        tickerSymbol: new FormControl(account.TickerSymbol),
        ownership: new FormControl(account.Ownership),
        numberOfEmployees: new FormControl(account.NumberOfEmployees, [Validators.pattern('^(\\d{0,8})$')]),
        sic: new FormControl(account.Sic),
        billingStreet: new FormControl(account.BillingStreet),
        billingCity: new FormControl(account.BillingCity),
        billingState: new FormControl(account.BillingState),
        billingPostalCode: new FormControl(account.BillingPostalCode),
        billingCountry: new FormControl(account.BillingCountry),
        shippingStreet: new FormControl(account.ShippingStreet),
        shippingCity: new FormControl(account.ShippingCity),
        shippingState: new FormControl(account.ShippingState),
        shippingPostalCode: new FormControl(account.ShippingPostalCode),
        shippingCountry: new FormControl(account.ShippingCountry),
        customerPriority__c: new FormControl(account.CustomerPriority__c),
        slaExpirationDate__c: new FormControl(this.changeFormatDate(account.SLAExpirationDate__c)),
        numberOfLocations__c: new FormControl(account.NumberofLocations__c, [Validators.pattern('^(\\d{0,3})$')]),
        active__c: new FormControl(account.Active__c),
        sla__c: new FormControl(account.SLA__c),
        slaSerialNumber__c: new FormControl(account.SLASerialNumber__c),
        upsellOpportunity__c: new FormControl(account.UpsellOpportunity__c),
        description: new FormControl(account.Description)
      });
      this.viewAccount = false;
      this.createAccount = false;
      this.updateAccount = true;
    } else {
      this.form = new FormGroup({
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        name: new FormControl('', [Validators.required]),
        accountNumber: new FormControl(''),
        parentId: new FormControl(null),
        site: new FormControl(''),
        type: new FormControl(''),
        industry: new FormControl(''),
        annualRevenue: new FormControl('', [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        rating: new FormControl(''),
        phone: new FormControl(''),
        fax: new FormControl(''),
        website: new FormControl(''),
        tickerSymbol: new FormControl(''),
        ownership: new FormControl(''),
        numberOfEmployees: new FormControl('', [Validators.pattern('^(\\d{0,8})$')]),
        sic: new FormControl(''),
        billingStreet: new FormControl(''),
        billingCity: new FormControl(''),
        billingState: new FormControl(''),
        billingPostalCode: new FormControl(''),
        billingCountry: new FormControl(''),
        shippingStreet: new FormControl(''),
        shippingCity: new FormControl(''),
        shippingState: new FormControl(''),
        shippingPostalCode: new FormControl(''),
        shippingCountry: new FormControl(''),
        customerPriority__c: new FormControl(''),
        slaExpirationDate__c: new FormControl(null),
        numberOfLocations__c: new FormControl('', [Validators.pattern('^(\\d{0,3})$')]),
        active__c: new FormControl(''),
        sla__c: new FormControl(''),
        slaSerialNumber__c: new FormControl(''),
        upsellOpportunity__c: new FormControl(''),
        description: new FormControl('')
      });
      this.createAccount = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      this.objectToSend = {
        SACAP__UUID__c: this.form.get('uuid__c').value,
        Name: this.form.get('name').value,
        AccountNumber: this.form.get('accountNumber').value,
        ParentId: this.form.get('parentId').value,
        Site: this.form.get('site').value,
        Type: this.form.get('type').value,
        Industry: this.form.get('industry').value,
        AnnualRevenue: this.form.get('annualRevenue').value,
        Rating: this.form.get('rating').value,
        Phone: this.form.get('phone').value,
        Fax: this.form.get('fax').value,
        Website: this.form.get('website').value,
        TickerSymbol: this.form.get('tickerSymbol').value,
        Ownership: this.form.get('ownership').value,
        NumberOfEmployees: this.form.get('numberOfEmployees').value,
        Sic: this.form.get('sic').value,
        BillingStreet: this.form.get('billingStreet').value,
        BillingCity: this.form.get('billingCity').value,
        BillingState: this.form.get('billingState').value,
        BillingPostalCode: this.form.get('billingPostalCode').value,
        BillingCountry: this.form.get('billingCountry').value,
        ShippingStreet: this.form.get('shippingStreet').value,
        ShippingCity: this.form.get('shippingCity').value,
        ShippingState: this.form.get('shippingState').value,
        ShippingPostalCode: this.form.get('shippingPostalCode').value,
        ShippingCountry: this.form.get('shippingCountry').value,
        CustomerPriority__c: this.form.get('customerPriority__c').value,
        SLAExpirationDate__c: this.form.get('slaExpirationDate__c').value,
        NumberofLocations__c: this.form.get('numberOfLocations__c').value,
        Active__c: this.form.get('active__c').value,
        SLA__c: this.form.get('sla__c').value,
        SLASerialNumber__c: this.form.get('slaSerialNumber__c').value,
        UpsellOpportunity__c: this.form.get('upsellOpportunity__c').value,
        Description: this.form.get('description').value
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('id').value, this.objectToSend)
          .subscribe((accountUpdated: any) => {
            if (accountUpdated) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your account has been saved',
                showConfirmButton: false,
                timer: 1500
              }).then(result => window.location.assign(`${window.location.origin}/account`));
            }
          });
      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((account: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your account has been saved',
            showConfirmButton: false,
            timer: 1500
          }).then(result => window.location.assign(`${window.location.origin}/account`));
        });
      }

    } else {
      this.isInvalid = true;
    }
  }
}
