import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { ModalService } from '../modal/modal.service';
import { Location } from '@angular/common';
import { isDate, isString } from 'util';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opportunity-sf',
  templateUrl: './opportunity-sf.component.html',
  styles: [`
  .action-button {
    min-width: 100px;
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

export class OpportunitySFComponent implements OnInit {

  form: FormGroup;
  typeValues: string[] = [
    'Existing Customer - Upgrade',
    'Existing Customer - Replacement',
    'Existing Customer - Downgrade',
    'New Customer'
  ];
  leadSourceValues: string[] = [
    'Web',
    'Phone Inquiry',
    'Partner Referral',
    'Purchased List',
    'Other'
  ];
  stageValues: string[] = [
    'Prospecting',
    'Qualification',
    'Needs Analysis',
    'Value Proposition',
    'Id. Decision Makers',
    'Perception Analysis',
    'Proposal/Price Quote',
    'Negotiation/Review',
    'Closed Won',
    'Closed Lost'
  ];

  isInvalid: boolean;
  objectAPI: string;

  createOpportunity: boolean;
  updateOpportunity: boolean;
  viewOpportunity: boolean;
  status: boolean;

  opportunity: any;
  objectToSend: any;

  lookUpAccount: any;
  lookUpContact: any;

  LookUpListings: any[] = [];
  LookUpListings404: boolean;

  searchText: string;
  specificSearch: boolean;
  paramID: string;

  constructor(
    private loopbackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    public modalService: ModalService,
    private location: Location,
    private router: Router,
  ) {
    this.isInvalid = false;
    this.objectAPI = 'Opportunities';
    this.createOpportunity = false;
    this.updateOpportunity = false;
    this.viewOpportunity = false;
    this.status = false;
    this.opportunity = {};
    this.objectToSend = {};
    this.lookUpAccount = null;
    this.lookUpContact = null;
    this.searchText = '';
    this.specificSearch = false;
    this.paramID = '';
    this.LookUpListings404 =  false;
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
    } else {
      this.activateRoute.params.subscribe((params: { id: string, status?: string }) => {
        this.paramID = params.id;
        this.getObject(params.id);
        this.status = params.status === 'update' ? true : false;
      });
    }
  }

  getObject(uuid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI,uuid).subscribe((object: any) => {
      this.opportunity = object;
      this.viewOpportunity = object ? true : false;
      if (this.status) {
        this.createForm(object);
      }
      this.getLookUps();
    }, (error) => {
      console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
    });
  }

  getLookUps() {
    if (this.opportunity.Account__SACAP__UUID__c) {
      this.loopbackService.getLookUp('Accounts', {where:{"SACAP__UUID__c":this.opportunity.Account__SACAP__UUID__c}}).subscribe((accounts: Array<{ any }>) => {
        this.lookUpAccount = accounts[0];
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpAccount =  null;
      });
    }
    /*if (this.opportunity.CampaignId) {
      this.loopbackService.getLookUp('Contacts',{where:{"SfId":this.opportunity.CampaignId}} ).subscribe((contacts: Array<{ any }>) => {
        this.lookUpContact = contacts[0];
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpContact =  null;
      });
    }*/
  }

  cancelAction(goBack?: boolean) {
    if (goBack) {
      this.router.navigate([`/opportunity`]);
    } else {
      this.viewOpportunity = true;
      this.createOpportunity = false;
      this.updateOpportunity = false;
      this.lookUpAccount = null;
      this.lookUpContact = null;
      this.getLookUps();
    }
  }

  changeFormatDate(formatDate: any): string {
    const date = new Date(formatDate);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    return date.getUTCFullYear() + '-' + month + '-' + day;
  }

  searchLookUp(lookUp: string) {
    this.loopbackService.getLookUpBySearch(lookUp, this.searchText).subscribe((data: any) => {
      this.LookUpListings = data;
      this.specificSearch = data.length > 90 && this.searchText ? true : false;
      this.LookUpListings404 = data.length < 1 ? true : false;
    }, (error) => {
      console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
      this.LookUpListings404 = true;
    });
  }

  clearSearch(lookUp) {
    this.searchText = '';
    this.searchLookUp(lookUp);
  }

  deleteLookUp(field: string) {
    if (field === 'account__SACAP__UUID__c') {
      this.form.controls['account__SACAP__UUID__c'].setValue('');
      this.lookUpAccount = null;
    } else if (field === 'campaignId') {
      this.form.controls['campaignId'].setValue('');
      this.lookUpContact = null;
    }
  }

  LookUpSelected(record: any, modalId: string) {
    if (modalId === 'searchAccount') {
      this.form.controls['account__SACAP__UUID__c'].setValue(record.SACAP__UUID__c);
      this.lookUpAccount = record;
      this.modalService.close(modalId);
    } /*else if (modalId === 'searchContact') {
      this.form.controls['campaignId'].setValue(record.SfId);
      this.lookUpContact = record;
      this.modalService.close(modalId);
    }*/
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

  createForm(opportunity?: any) {
    if (opportunity) {
      this.form = new FormGroup({
        id: new FormControl(opportunity.id),
        uuid__c: new FormControl(opportunity.SACAP__UUID__c, [Validators.required]),
        isPrivate: new FormControl(opportunity.IsPrivate),
        name: new FormControl(opportunity.Name, [Validators.required]),
        account__SACAP__UUID__c: new FormControl(opportunity.Account__SACAP__UUID__c),
        type: new FormControl(opportunity.Type),
        leadSource: new FormControl(opportunity.LeadSource),
        amount: new FormControl(opportunity.Amount, [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        revenue: new FormControl(opportunity.ExpectedRevenue, [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        closeDate: new FormControl(opportunity.CloseDate ? this.changeFormatDate(opportunity.CloseDate): null, [Validators.required]),
        nextStep: new FormControl(opportunity.NextStep),
        stageName: new FormControl(opportunity.StageName, [Validators.required]),
        probability: new FormControl(opportunity.Probability, [Validators.pattern('^(\\d{0,3})$')]),
        description: new FormControl(opportunity.Description)
      });
      this.createOpportunity = false;
      this.viewOpportunity = false;
      this.updateOpportunity = true;
    } else {
      this.form = new FormGroup({
        id: new FormControl(null),
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        isPrivate: new FormControl(false),
        name: new FormControl('', [Validators.required]),
        account__SACAP__UUID__c: new FormControl(''),
        type: new FormControl(''),
        leadSource: new FormControl(''),
        amount: new FormControl('', [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        revenue: new FormControl('', [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        closeDate: new FormControl(null, [Validators.required]),
        nextStep: new FormControl(''),
        stageName: new FormControl('', [Validators.required]),
        probability: new FormControl('', [Validators.pattern('^(\\d{0,3})$')]),
        description: new FormControl('')
      });
      this.createOpportunity = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      if (this.form.controls['closeDate'].value) {
        let closeDate = new Date(this.form.controls['closeDate'].value);
        this.form.controls['closeDate'].setValue(closeDate.toISOString());
      };
      this.objectToSend = {
        id: this.form.get('id').value ? this.form.get('id').value : null,
        SACAP__UUID__c: this.form.get('uuid__c').value,
        IsPrivate: this.form.get('isPrivate').value,
        Name: this.form.get('name').value,
        Account__SACAP__UUID__c: this.form.get('account__SACAP__UUID__c').value,
        Type: this.form.get('type').value,
        LeadSource: this.form.get('leadSource').value,
        Amount: parseInt(this.form.get('amount').value),
        ExpectedRevenue: parseInt(this.form.get('revenue').value),
        CloseDate: this.form.get('closeDate').value,
        NextStep: this.form.get('nextStep').value,
        StageName: this.form.get('stageName').value,
        Probability: parseInt(this.form.get('probability').value),
        Description: this.form.get('description').value
      };
      for (var index in this.objectToSend) {
        if (!isString(this.objectToSend[index]) && !isDate(this.objectToSend[index]) && isNaN(this.objectToSend[index])) delete this.objectToSend[index];
        if (this.objectToSend[index] === null || this.objectToSend[index] === undefined || this.objectToSend[index] === '') delete this.objectToSend[index];
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('uuid__c').value, this.objectToSend).subscribe((opportunityUpdate: any) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your opportunity has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.getObject(this.paramID);
              this.createOpportunity = false;
              this.updateOpportunity = false;
              this.status = null;
            });
          }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((opportunity: any) => {
          if (opportunity) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your opportunity has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => this.router.navigate([`/opportunity`]));
          }
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      }
    } else {
      this.isInvalid = true;
    }
  }
}
