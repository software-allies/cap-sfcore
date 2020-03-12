import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-lead-sf',
  templateUrl: './lead-sf.component.html',
  styles: [``]
})
export class LeadSFComponent implements OnInit {

  form: FormGroup;
  salutationValues: string[] = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof'];
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

  objectAPI: string;
  lead: any;

  objectToSend: any;
  isInvalid: boolean;
  lookUpContact: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private loopbackService: LoopbackService
  ) {
    this.createLead = false;
    this.updateLead = false;
    this.viewLead = false;

    this.objectToSend = {};
    this.lead = {};
    this.isInvalid = false;
    this.objectAPI = 'Leads';
    this.lookUpContact = [];
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: {id: string}) => {
       this.getObject(params.id);
      });
    }
    this.getContactLookUp();
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
      this.lead = object;
      this.viewLead = object ? true : false;
    });
  }

  getContactLookUp() {
    this.loopbackService.getAllRequest('Contacts').subscribe((contacts: Array<{any}>) => {
      this.lookUpContact = contacts;
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

  createForm(contact?: any) {
    if (contact) {
      this.form = new FormGroup({
        id: new FormControl(contact.id, [Validators.required]),
        uuid__c: new FormControl(contact.SACAP__UUID__c, [Validators.required]),
        salutation: new FormControl(contact.Salutation),
        firstName: new FormControl(contact.FirstName),
        lastName: new FormControl(contact.LastName, [Validators.required]),
        company: new FormControl(contact.Company, [Validators.required]),
        title: new FormControl(contact.Title),
        leadSource: new FormControl(contact.LeadSource),
        // campaignId: new FormControl(contact.CampaignId),
        industry: new FormControl(contact.Industry),
        annualRevenue: new FormControl(contact.AnnualRevenue, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        phone: new FormControl(contact.Phone),
        mobilePhone: new FormControl(contact.MobilePhone),
        fax: new FormControl(contact.Fax),
        email: new FormControl(contact.Email, [Validators.pattern('(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:[a-zA-Z]{1,5})$)')]),
        website: new FormControl(contact.Website),
        status: new FormControl(contact.Status, [Validators.required]),
        rating: new FormControl(contact.Rating),
        numberOfEmployees: new FormControl(contact.NumberOfEmployees, [Validators.pattern('^(\\d{0,8})$')]),
        street: new FormControl(contact.Street),
        city: new FormControl(contact.City),
        state: new FormControl(contact.State),
        postalCode: new FormControl(contact.PostalCode),
        country: new FormControl(contact.Country),
        productInterest__c: new FormControl(contact.ProductInterest__c),
        sicCode__c: new FormControl(contact.SICCode__c),
        numberOfLocations__c: new FormControl(contact.NumberofLocations__c, [Validators.pattern('^(\\d{0,3})$')]),
        currentGenerators__c: new FormControl(contact.CurrentGenerators__c),
        primary__c: new FormControl(contact.Primary__c),
        description: new FormControl(contact.Description)
      });
      this.createLead = false;
      this.viewLead = false;
      this.updateLead = true;
    } else {
      this.form = new FormGroup({
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        salutation: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl('', [Validators.required]),
        company: new FormControl('', [Validators.required]),
        title: new FormControl(''),
        leadSource: new FormControl(''),
        // campaignId: new FormControl(''),
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
        productInterest__c: new FormControl(''),
        sicCode__c: new FormControl(''),
        numberOfLocations__c: new FormControl('', [Validators.pattern('^(\\d{0,3})$')]),
        currentGenerators__c: new FormControl(''),
        primary__c: new FormControl(''),
        description: new FormControl('')
      });
      this.createLead = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      this.objectToSend = {
        SACAP__UUID__c: this.form.get('uuid__c').value,
        Salutation: this.form.get('salutation').value,
        FirstName: this.form.get('firstName').value,
        LastName: this.form.get('lastName').value,
        Company:this.form.get('company').value,
        Title: this.form.get('title').value,
        LeadSource: this.form.get('leadSource').value,
        // CampaignId: this.form.get('campaignId').value,
        Industry: this.form.get('industry').value,
        AnnualRevenue: this.form.get('annualRevenue').value,
        Phone: this.form.get('phone').value,
        MobilePhone: this.form.get('mobilePhone').value,
        Fax: this.form.get('fax').value,
        Email: this.form.get('email').value,
        Website: this.form.get('website').value,
        Status: this.form.get('status').value,
        Rating: this.form.get('rating').value,
        NumberOfEmployees: this.form.get('numberOfEmployees').value,
        Street: this.form.get('street').value,
        City: this.form.get('city').value,
        State: this.form.get('state').value,
        PostalCode: this.form.get('postalCode').value,
        Country: this.form.get('country').value,
        ProductInterest__c: this.form.get('productInterest__c').value,
        SICCode__c: this.form.get('sicCode__c').value,
        NumberofLocations__c: this.form.get('numberOfLocations__c').value,
        CurrentGenerators__c: this.form.get('currentGenerators__c').value,
        Primary__c: this.form.get('primary__c').value,
        Description: this.form.get('description').value
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('id').value, this.objectToSend).subscribe((leadUpdated: any) => {
          if (leadUpdated) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your lead has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(result => this.router.navigate([`/lead`]));
          }
        });
      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((lead: any) => {
          if (lead) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your contact has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(result => this.router.navigate([`/lead`]));
          }
        });
      }
    } else {
      this.isInvalid = true;
    }
  }
}
