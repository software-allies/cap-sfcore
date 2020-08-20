import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-sf',
  templateUrl: './contact-sf.component.html',
  styles: [`
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
  status: boolean;

  lookUpAccount: any;
  lookUpContact: any;

  LookUpListings: any[] = [];
  LookUpListings404: boolean;

  searchText: string;
  paramId: string = '';

  constructor(
    private loopbackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    public modalService: ModalService,
    private location: Location,
    private router: Router
  ) {
    this.createContact = false;
    this.updateContact = false;
    this.viewContact = false;
    this.status = false;
    this.isInvalid = false;
    this.objectToSend = {};
    this.objectAPI = 'Contacts';
    this.contact = {};
    this.lookUpAccount = null;
    this.lookUpContact = null;
    this.searchText = '';
    this.LookUpListings404 =  false;
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: { id: string, status?: string }) => {
        this.paramId = params.id
        this.getObject(params.id);
        this.status = params.status === 'update' ? true : false;
      });
    }
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
      this.contact = object;
      this.viewContact = object ? true : false;
      if (this.status) {
        this.createForm(object);
      }
      this.getLookUps();
    }, (error) => {
      console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
    });
  }

  getLookUps() {
    if (this.contact.AccountId) {
      this.loopbackService.getLookUp('Accounts', this.contact.AccountId).subscribe((accounts: Array<{ any }>) => {
        this.lookUpAccount = accounts;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpAccount =  null;
      });
    }
    if (this.contact.ReportsToId) {
      this.loopbackService.getLookUp('Contacts', this.contact.ReportsToId).subscribe((contacts: Array<{ any }>) => {
        this.lookUpContact = contacts;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpContact =  null;
      });
    }
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

  searchLookUp(lookUp: string) {
    this.loopbackService.getLookUpBySearch(lookUp, this.searchText).subscribe((data: any) => {
      this.LookUpListings = data;
      this.LookUpListings404 = data.length < 1 ? true : false;
    }, (error) => {
      console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
      this.LookUpListings404 = true;
    });
  }

  deselectLookUp(modalId: string) {
    if (modalId === 'searchAccount') {
      this.form.controls['accountId'].setValue('');
      this.modalService.close(modalId);
      this.lookUpAccount = null;
    } else if (modalId === 'searchContact') {
      this.form.controls['campaignId'].setValue('');
      this.modalService.close(modalId);
      this.lookUpContact = null;
    }
  }

  LookUpSelected(record: any, modalId: string) {
    if (modalId === 'searchAccount') {
      this.form.controls['accountId'].setValue(record.SfId);
      this.lookUpAccount = record;
      this.modalService.close(modalId);
    } else if (modalId === 'searchContact') {
      this.form.controls['reportsToId'].setValue(record.SfId);
      this.lookUpContact = record;
      this.modalService.close(modalId);
    }
  }

  onCloseModal(event: boolean) {
    if (event) {
      this.searchText = '';
      this.LookUpListings404 = false;
      this.LookUpListings = [];
    }
  }

  OnOpenModal(event: boolean) {
    if (event) {
      this.searchText = '';
      this.LookUpListings404 = false;
    }
  }

  changeFormatDate(formatDate: any): string {
    const date = new Date(formatDate);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    return date.getUTCFullYear() + '-' + month + '-' + day;
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
            }).then(result => window.location.assign(`${window.location.origin}/contact/${this.paramId}`));
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
            }).then(result => window.location.assign(`${window.location.origin}/contact`));
          }
        });
      }
    } else {
      this.isInvalid = true;
    }
  }
}
