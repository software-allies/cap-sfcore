import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { isDate, isString } from 'util';

@Component({
  selector: 'app-lead-sf',
  templateUrl: './lead-sf.component.html',
  styles: [`
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width:100%;
  }
  .action-button {
    min-width: 100px;
  }
  `]
})
export class LeadSFComponent implements OnInit {

  form: FormGroup;
  salutationValues: string[] = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  leadSourceValues: string[] = [
    'Web',
    'Phone Inquiry',
    'Partner Referral',
    'Purchased List',
    'Other'
  ];
  productInterestValues: string[] = [
    'GC1000 series',
    'GC5000 series',
    'GC3000 series'
  ];
  primaryValues: string[] = ['Yes', 'No'];
  statusValues: string[] = [
    'Open - Not Contacted',
    'Working - Contacted',
    'Closed - Converted',
    'Closed - Not Converted'
  ];
  ratingValues: string[] = ['Hot', 'Warm', 'Cold'];
  industryValues: string[] = [
    'Agriculture',
    'Apparel',
    'Banking',
    'Biotechnology',
    'Chemicals',
    'Communications',
    'Construction',
    'Consulting',
    'Education',
    'Electronics',
    'Energy',
    'Engineering',
    'Entertainment',
    'Environmental',
    'Finance',
    'Food & Beverage',
    'Government',
    'Healthcare',
    'Hospitality',
    'Insurance',
    'Machinery',
    'Media',
    'Manufacturing',
    'Not For Profit',
    'Recreation',
    'Retail',
    'Shipping',
    'Technology',
    'Telecommunications',
    'Transportation',
    'Utilities',
    'Other'
  ];

  createLead: boolean;
  updateLead: boolean;
  viewLead: boolean;
  status: boolean;

  objectAPI: string;
  lead: any;

  objectToSend: any;
  isInvalid: boolean;
  paramID: string = '';

  constructor(
    private loopbackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.createLead = false;
    this.updateLead = false;
    this.viewLead = false;
    this.status = false;
    this.objectToSend = {};
    this.lead = {};
    this.isInvalid = false;
    this.objectAPI = 'Leads';
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: {id: string, status?: string}) => {
      this.paramID = params.id;
      this.getObject(params.id);
      this.status = params.status === 'update' ? true : false;
      });
    }
  }

  getObject(uuid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI,uuid).subscribe((object: any) => {
      this.lead = object;
      this.viewLead = object ? true : false;
      if (this.status) {
        this.createForm(object);
      }
    });
  }

  cancelAction(goBack?: boolean) {
    if (goBack) {
      this.router.navigate([`/lead`]);
    } else {
      this.viewLead = true;
      this.createLead = false;
      this.updateLead = false;
    }
  }

  createForm(lead?: any) {
    if (lead) {
      this.form = new FormGroup({
        id: new FormControl(lead.id),
        uuid__c: new FormControl(lead.SACAP__UUID__c, [Validators.required]),
        salutation: new FormControl(lead.Salutation),
        firstName: new FormControl(lead.FirstName),
        lastName: new FormControl(lead.LastName, [Validators.required]),
        company: new FormControl(lead.Company, [Validators.required]),
        title: new FormControl(lead.Title),
        leadSource: new FormControl(lead.LeadSource),
        industry: new FormControl(lead.Industry),
        annualRevenue: new FormControl(lead.AnnualRevenue, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        phone: new FormControl(lead.Phone),
        mobilePhone: new FormControl(lead.MobilePhone),
        fax: new FormControl(lead.Fax),
        email: new FormControl(lead.Email, [Validators.pattern('(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:[a-zA-Z]{1,5})$)')]),
        website: new FormControl(lead.Website),
        status: new FormControl(lead.Status, [Validators.required]),
        rating: new FormControl(lead.Rating),
        numberOfEmployees: new FormControl(lead.NumberOfEmployees, [Validators.pattern('^(\\d{0,8})$')]),
        street: new FormControl(lead.Street),
        city: new FormControl(lead.City),
        state: new FormControl(lead.State),
        postalCode: new FormControl(lead.PostalCode),
        country: new FormControl(lead.Country),
        description: new FormControl(lead.Description)
      });
      this.createLead = false;
      this.viewLead = false;
      this.updateLead = true;
    } else {
      this.form = new FormGroup({
        id:  new FormControl(null),
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        salutation: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl('', [Validators.required]),
        company: new FormControl('', [Validators.required]),
        title: new FormControl(''),
        leadSource: new FormControl(''),
        industry: new FormControl(''),
        annualRevenue: new FormControl('', [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        phone: new FormControl(''),
        mobilePhone: new FormControl(''),
        fax: new FormControl(''),
        email: new FormControl('', [Validators.pattern('(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:[a-zA-Z]{1,5})$)')]),
        website: new FormControl(''),
        status: new FormControl('', [Validators.required]),
        rating: new FormControl(''),
        numberOfEmployees: new FormControl('', [Validators.pattern('^(\\d{0,8})$')]),
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        postalCode: new FormControl(''),
        country: new FormControl(''),
        description: new FormControl('')
      });
      this.createLead = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      this.objectToSend = {
        id: this.form.get('id').value ? this.form.get('id').value : null,
        SACAP__UUID__c: this.form.get('uuid__c').value,
        Salutation: this.form.get('salutation').value,
        FirstName: this.form.get('firstName').value,
        LastName: this.form.get('lastName').value,
        Company: this.form.get('company').value,
        Title: this.form.get('title').value,
        LeadSource: this.form.get('leadSource').value,
        Industry: this.form.get('industry').value,
        AnnualRevenue: parseInt(this.form.get('annualRevenue').value),
        Phone: this.form.get('phone').value,
        MobilePhone: this.form.get('mobilePhone').value,
        Fax: this.form.get('fax').value,
        Email: this.form.get('email').value,
        Website: this.form.get('website').value,
        Status: this.form.get('status').value,
        Rating: this.form.get('rating').value,
        NumberOfEmployees: parseInt(this.form.get('numberOfEmployees').value),
        Street: this.form.get('street').value,
        City: this.form.get('city').value,
        State: this.form.get('state').value,
        PostalCode: this.form.get('postalCode').value,
        Country: this.form.get('country').value,
        Description: this.form.get('description').value
        /*CampaignId: this.form.get('campaignId').value,
        ProductInterest__c: this.form.get('productInterest__c').value,
        SICCode__c: this.form.get('sicCode__c').value,
        NumberofLocations__c: parseInt(this.form.get('numberOfLocations__c').value),
        CurrentGenerators__c: this.form.get('currentGenerators__c').value,
        Primary__c: this.form.get('primary__c').value,*/
      };
      for (var index in this.objectToSend) {
        if (!isString(this.objectToSend[index]) && !isDate(this.objectToSend[index]) && isNaN(this.objectToSend[index])) delete this.objectToSend[index];
        if (this.objectToSend[index] === null || this.objectToSend[index] === undefined || this.objectToSend[index] === '') delete this.objectToSend[index];
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('uuid__c').value, this.objectToSend).subscribe((leadUpdated: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your lead has been saved',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getObject(this.paramID);
            this.createLead = false;
            this.updateLead = false;
            this.status = null;
          });
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((lead: any) => {
          if (lead) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your contact has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => this.router.navigate([`/lead`]));
          }
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      }
    } else {
      this.isInvalid = true;
    }
  }
}
