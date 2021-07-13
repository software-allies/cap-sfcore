import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { ActivatedRoute, Router, NavigationExtras, NavigationEnd, Event} from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { isDate, isString } from 'util';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-sf',
  templateUrl: './contact-sf.component.html',
  styles: [`
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width:100%;
  }
  tr.tr-row>td,
  tr.tr-row>th{
    padding-bottom:1rem;
    padding-top:1rem;
    border-bottom:1px solid #dee2e6;
  }
  tr.tr-space>td,
  tr.tr-space>th{
    padding-bottom:1rem;
    padding-top:1rem;
  }
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
  specificSearch: boolean;

  activeRoute: string;
  paramId: string;

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
    this.specificSearch = false;
    this.paramId = '';
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

  getObject(uuid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, uuid).subscribe((object: any) => {
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
    if (this.contact.Account__SACAP__UUID__c) {
      this.loopbackService.getLookUp('Accounts', {where:{"SACAP__UUID__c":this.contact.Account__SACAP__UUID__c}}).subscribe((accounts: Array<{ any }>) => {
        this.lookUpAccount = accounts[0];
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpAccount =  null;
      });
    }
    if (this.contact.ReportsTo__SACAP__UUID__c) {
      this.loopbackService.getLookUp('Contacts',{where:{"SACAP__UUID__c":this.contact.ReportsTo__SACAP__UUID__c}}).subscribe((contacts: Array<{ any }>) => {
        this.lookUpContact = contacts[0];
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
      this.lookUpAccount = null;
      this.lookUpContact = null;
      this.getLookUps();
    }
  }

  searchLookUp(lookUp: string) {
    if (lookUp === 'Accounts') {
      this.loopbackService.getLookUpBySearch(lookUp, this.searchText).subscribe((data: any) => {
        this.LookUpListings = data;
        this.specificSearch = data.length > 90 && this.searchText ? true : false;
        this.LookUpListings404 = data.length < 1 ? true : false;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.LookUpListings404 = true;
      });
    } else if (lookUp === 'Contacts') {
      this.loopbackService.getLookUpBySearchWithoutName(lookUp, this.searchText).subscribe((data: any) => {
        this.LookUpListings = data;
        this.specificSearch = data.length > 90 && this.searchText ? true : false;
        this.LookUpListings404 = data.length < 1 ? true : false;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.LookUpListings404 = true;
      });
    }
  }

  clearSearch(lookUp) {
    this.searchText = '';
    this.searchLookUp(lookUp);
  }

  deleteLookUp(field: string) {
    if (field === 'account__SACAP__UUID__c') {
      this.form.controls['account__SACAP__UUID__c'].setValue('');
      this.lookUpAccount = null;
    } else if (field === 'reportsTo__SACAP__UUID__c') {
      this.form.controls['reportsTo__SACAP__UUID__c'].setValue('');
      this.lookUpContact = null;
    }
  }

  LookUpSelected(record: any, modalId: string) {
    if (modalId === 'searchAccount') {
      this.form.controls['account__SACAP__UUID__c'].setValue(record.SACAP__UUID__c);
      this.lookUpAccount = record;
      this.modalService.close(modalId);
    } else if (modalId === 'searchContact') {
      this.form.controls['reportsTo__SACAP__UUID__c'].setValue(record.SACAP__UUID__c);
      this.lookUpContact = record;
      this.modalService.close(modalId);
    }
  }

  onCloseModal(event: boolean) {
    if (event) {
      this.searchText = '';
      this.LookUpListings404 = false;
      this.LookUpListings = [];
      this.specificSearch = false;
    }
  }

  OnOpenModal(event: boolean) {
    if (event) {
      this.searchText = '';
      this.LookUpListings404 = false;
      this.specificSearch = false;
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
        id: new FormControl(contact.id),
        uuid__c: new FormControl(contact.SACAP__UUID__c, [Validators.required]),
        salutation: new FormControl(contact.Salutation),
        firstName: new FormControl(contact.FirstName, [Validators.pattern('^[A-Za-z ]{0,}$')]),
        lastName: new FormControl(contact.LastName, [Validators.required, Validators.pattern('^[A-Za-z ]{0,}$')]),
        account__SACAP__UUID__c: new FormControl(contact.Account__SACAP__UUID__c),
        reportsTo__SACAP__UUID__c: new FormControl(contact.ReportsTo__SACAP__UUID__c),
        title: new FormControl(contact.Title),
        department: new FormControl(contact.Department),
        birthdate: new FormControl(contact.Birthdate ? this.changeFormatDate(contact.Birthdate) : null),
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
        description: new FormControl(contact.Description)
      });
      this.viewContact = false;
      this.createContact = false;
      this.updateContact = true;
    } else {
      this.form = new FormGroup({
        id: new FormControl(null),
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        salutation: new FormControl(''),
        firstName: new FormControl('', [Validators.pattern('^[A-Za-z ]{0,}$')]),
        lastName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]{0,}$')]),
        account__SACAP__UUID__c: new FormControl(''),
        reportsTo__SACAP__UUID__c: new FormControl(''),
        title: new FormControl(''),
        department: new FormControl(''),
        birthdate: new FormControl(null),
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
        description: new FormControl('')
      });
      this.createContact = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      if (this.form.controls['birthdate'].value) {
        let birthdate = new Date(this.form.controls['birthdate'].value);
        this.form.controls['birthdate'].setValue(birthdate.toISOString());
      };
      this.objectToSend = {
        id: this.form.get('id').value ? this.form.get('id').value : null,
        SACAP__UUID__c: this.form.get('uuid__c').value,
        Salutation: this.form.get('salutation').value,
        FirstName: this.form.get('firstName').value,
        LastName: this.form.get('lastName').value,
        Account__SACAP__UUID__c: this.form.get('account__SACAP__UUID__c').value,
        ReportsTo__SACAP__UUID__c: this.form.get('reportsTo__SACAP__UUID__c').value,
        Title: this.form.get('title').value,
        Department: this.form.get('department').value,
        Birthdate: this.form.get('birthdate').value,
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
        Description: this.form.get('description').value
      };
      for (var index in this.objectToSend) {
        if (!isString(this.objectToSend[index]) && !isDate(this.objectToSend[index]) && isNaN(this.objectToSend[index])) delete this.objectToSend[index];
        if (this.objectToSend[index] === null || this.objectToSend[index] === undefined || this.objectToSend[index] === '') delete this.objectToSend[index];
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('uuid__c').value, this.objectToSend).subscribe((contactUpdated: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your contact has been saved',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getObject(this.paramId);
            this.createContact = false;
            this.updateContact = false;
            this.status = null;
          });
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
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
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      }
    } else {
      this.isInvalid = true;
    }
  }
}
