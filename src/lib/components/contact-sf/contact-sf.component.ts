import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-contact-sf',
  templateUrl: './contact-sf.component.html',
  styles: [``]
})
export class ContactSFComponent implements OnInit {

  form: FormGroup;
  salutationValues: string[] = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  leadSourceValues: string[] = [
    'Web',
    'Phone Inquiry',
    'Partner Referral',
    'Purchased List',
    'Other'
  ];
  levelValues: string[] = ['Secondary', 'Tertiary', 'Primary'];
  isInvalid: boolean;

  objectAPI: string;
  contact: any;
  objectToSend: any;

  createContact: boolean;
  updateContact: boolean;
  viewContact: boolean;

  lookUpAccount: any;
  lookUpContact: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private loopbackService: LoopbackService
  ) {
    this.createContact = false;
    this.updateContact = false;
    this.viewContact = false;

    this.isInvalid = false;
    this.objectToSend = {};

    this.objectAPI = 'Contacts';
    this.contact = {};
    this.lookUpAccount = null;
    this.lookUpContact = null;
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: {id: string}) => {
        this.getObject(params.id);
      });
    }
    this.getLookUps();
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
      this.contact = object;
      this.viewContact = object ? true : false;
    });
  }

  getLookUps() {
    this.loopbackService.getAllRequest('Accounts').subscribe((accounts: Array<{any}>) => {
      this.lookUpAccount = accounts;
    });
    this.loopbackService.getAllRequest('Contacts').subscribe((contacts: Array<{any}>) => {
      this.lookUpContact = contacts;
    });
  }

  cancelAction(goBack?: boolean) {
    if (goBack) {
      this.router.navigate([`/contact`]);
    } else {
      this.viewContact = true;
      this.createContact = false;
      this.updateContact = false;
    }
  }

  changeFormatDate(formatDate: any) {
    const date = new Date(formatDate);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear() + '-' + month + '-' + day;
  }

  LookUpAccountName(AccountId: string): string {
    return  this.lookUpAccount && AccountId && this.lookUpAccount.find(x => x.SfId === AccountId) ?
            this.lookUpAccount.find(x => x.SfId === AccountId).Name
            : '';
  }

  LookUpReportsTo(ReportsToId: string): string {
    return  this.lookUpContact && ReportsToId && this.lookUpContact.find(x => x.SfId === ReportsToId) ?
            this.lookUpContact.find(x => x.SfId === ReportsToId).FirstName
            : '';
  }

  createForm(contact?: any) {
    if (contact) {
      this.form = new FormGroup({
        id: new FormControl(contact.id, [Validators.required]),
        uuid__c: new FormControl(contact.SACAP__UUID__c, [Validators.required]),
        salutation: new FormControl(contact.Salutation),
        firstName: new FormControl(contact.FirstName, [Validators.pattern('^[A-Za-z ]{0,}$')]),
        lastName: new FormControl(contact.LastName, [Validators.required, Validators.pattern('^[A-Za-z ]{0,}$')]),
        accountId: new FormControl(contact.AccountId),
        title: new FormControl(contact.Title),
        department: new FormControl(contact.Department),
        birthdate: new FormControl(this.changeFormatDate(contact.Birthdate)),
        reportsToId: new FormControl(contact.ReportsToId),
        leadSource: new FormControl(contact.LeadSource),
        phone: new FormControl(contact.Phone),
        homePhone: new FormControl(contact.HomePhone),
        mobilePhone: new FormControl(contact.MobilePhone),
        otherPhone: new FormControl(contact.OtherPhone),
        fax: new FormControl(contact.Fax),
        email: new FormControl(contact.Email, [Validators.pattern('(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:[a-zA-Z]{1,5})$)')]),
        assistantName: new FormControl(contact.AssistantName),
        assistantPhone: new FormControl(contact.AssistantPhone),
        mailingStreet: new FormControl(contact.MailingStreet),
        mailingCity: new FormControl(contact.MailingCity),
        mailingState: new FormControl(contact.MailingState),
        mailingPostalCode: new FormControl(contact.MailingPostalCode),
        mailingCountry: new FormControl(contact.MailingCountry),
        otherStreet: new FormControl(contact.OtherStreet),
        otherCity: new FormControl(contact.OtherCity),
        otherState: new FormControl(contact.OtherState),
        otherPostalCode: new FormControl(contact.OtherPostalCode),
        otherCountry: new FormControl(contact.OtherCountry),
        languages__c: new FormControl(contact.Languages__c),
        level__c: new FormControl(contact.Level__c),
        description: new FormControl(contact.Description)
      });
      this.viewContact = false;
      this.createContact = false;
      this.updateContact = true;
    } else {
      this.form = new FormGroup({
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        salutation: new FormControl(''),
        firstName: new FormControl('', [Validators.pattern('^[A-Za-z ]{0,}$')]),
        lastName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]{0,}$')]),
        accountId: new FormControl(''),
        title: new FormControl(''),
        department: new FormControl(''),
        birthdate: new FormControl(null),
        reportsToId: new FormControl(''),
        leadSource: new FormControl(''),
        phone: new FormControl(''),
        homePhone: new FormControl(''),
        mobilePhone: new FormControl(''),
        otherPhone: new FormControl(''),
        fax: new FormControl(''),
        email: new FormControl('', [Validators.pattern('(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(?:[a-zA-Z]{1,5})$)')]),
        assistantName: new FormControl(''),
        assistantPhone: new FormControl(''),
        mailingStreet: new FormControl(''),
        mailingCity: new FormControl(''),
        mailingState: new FormControl(''),
        mailingPostalCode: new FormControl(''),
        mailingCountry: new FormControl(''),
        otherStreet: new FormControl(''),
        otherCity: new FormControl(''),
        otherState: new FormControl(''),
        otherPostalCode: new FormControl(''),
        otherCountry: new FormControl(''),
        languages__c: new FormControl(''),
        level__c: new FormControl(''),
        description: new FormControl('')
      });
      this.createContact = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      this.objectToSend = {
        SACAP__UUID__c: this.form.get('uuid__c').value,
        Salutation: this.form.get('salutation').value,
        FirstName: this.form.get('firstName').value,
        LastName: this.form.get('lastName').value,
        AccountId: this.form.get('accountId').value,
        Title: this.form.get('title').value,
        Department: this.form.get('department').value,
        Birthdate: this.form.get('birthdate').value,
        ReportsToId: this.form.get('reportsToId').value,
        LeadSource: this.form.get('leadSource').value,
        Phone: this.form.get('phone').value,
        HomePhone: this.form.get('homePhone').value,
        MobilePhone: this.form.get('mobilePhone').value,
        OtherPhone: this.form.get('otherPhone').value,
        Fax: this.form.get('fax').value,
        Email: this.form.get('email').value,
        AssistantName: this.form.get('assistantName').value,
        AssistantPhone: this.form.get('assistantPhone').value,
        MailingStreet: this.form.get('mailingStreet').value,
        MailingCity: this.form.get('mailingCity').value,
        MailingState: this.form.get('mailingState').value,
        MailingPostalCode: this.form.get('mailingPostalCode').value,
        MailingCountry: this.form.get('mailingCountry').value,
        OtherStreet: this.form.get('otherStreet').value,
        OtherCity: this.form.get('otherCity').value,
        OtherState: this.form.get('otherState').value,
        OtherPostalCode: this.form.get('otherPostalCode').value,
        OtherCountry: this.form.get('otherCountry').value,
        Languages__c: this.form.get('languages__c').value,
        Level__c: this.form.get('level__c').value,
        Description: this.form.get('description').value,
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('id').value, this.objectToSend).subscribe((contactUpdated: any) => {
          if (contactUpdated) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your contact has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(result => this.router.navigate([`/contact`]));
          }
        });
      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((contact: any) => {
          if (contact) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your contact has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(result => this.router.navigate([`/contact`]));
          }
        });
      }
    } else {
      this.isInvalid = true;
    }
  }


}
