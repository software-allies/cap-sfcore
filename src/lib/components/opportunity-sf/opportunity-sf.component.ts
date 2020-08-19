import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { ModalService } from '../modal/modal.service';
import { Location } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opportunity-sf',
  templateUrl: './opportunity-sf.component.html',
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
  // tslint:disable-next-line: variable-name
  deliveryInstallationStatus__cValues: string[] = [
    'In progress',
    'Yet to begin',
    'Completed'
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
  paramID: string = '';

  constructor(
    private loopbackService: LoopbackService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService,
    private location: Location,
    private router: Router,
  ) {
    this.isInvalid = false;
    this.objectAPI = 'Opportunitys';

    this.createOpportunity = false;
    this.updateOpportunity = false;
    this.viewOpportunity = false;
    this.status = false;

    this.opportunity = {};
    this.objectToSend = {};
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
        this.paramID = params.id;
        this.getObject(params.id);
        this.status = params.status === 'update' ? true : false;
      });
    }
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
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
    if (this.opportunity.AccountId) {
      this.loopbackService.getLookUp('Accounts', this.opportunity.AccountId).subscribe((accounts: Array<{ any }>) => {
        this.lookUpAccount = accounts;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpAccount =  null;
      });
    }

    if (this.opportunity.CampaignId) {
      this.loopbackService.getLookUp('Contacts', this.opportunity.CampaignId).subscribe((contacts: Array<{ any }>) => {
        this.lookUpContact = contacts;
      }, (error) => {
        console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText);
        this.lookUpContact =  null;
      });
    }
  }

  cancelAction(goBack?: boolean) {
    if (goBack) {
      this.router.navigate([`/opportunity`]);
    } else {
      this.viewOpportunity = true;
      this.createOpportunity = false;
      this.updateOpportunity = false;
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
      this.form.controls['campaignId'].setValue(record.SfId);
      this.lookUpContact = record;
      this.modalService.close(modalId);
    }
  }

  onCloseModal() {
    this.searchText = '';
    this.LookUpListings404 = false;
    this.LookUpListings = [];
  }

  OnOpenModal() {
    this.searchText = '';
    this.LookUpListings404 = false;
  }

  createForm(opportunity?: any) {
    if (opportunity) {
      this.form = new FormGroup({
        id: new FormControl(opportunity.id, [Validators.required]),
        uuid__c: new FormControl(opportunity.SACAP__UUID__c, [Validators.required]),
        isPrivate: new FormControl(opportunity.IsPrivate),
        name: new FormControl(opportunity.Name, [Validators.required]),
        accountId: new FormControl(opportunity.AccountId),
        type: new FormControl(opportunity.Type),
        leadSource: new FormControl(opportunity.LeadSource),
        amount: new FormControl(opportunity.Amount, [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        revenue: new FormControl(opportunity.ExpectedRevenue, [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        closeDate: new FormControl(this.changeFormatDate(opportunity.CloseDate), [Validators.required]),
        nextStep: new FormControl(opportunity.NextStep),
        stageName: new FormControl(opportunity.StageName, [Validators.required]),
        probability: new FormControl(opportunity.Probability, [Validators.pattern('^(\\d{0,3})$')]),
        campaignId: new FormControl(opportunity.CampaignId),
        orderNumber__c: new FormControl(opportunity.OrderNumber__c),
        currentGenerators__c: new FormControl(opportunity.CurrentGenerators__c),
        trackingNumber__c: new FormControl(opportunity.TrackingNumber__c),
        mainCompetitors__c: new FormControl(opportunity.MainCompetitors__c),
        deliveryInstallationStatus__c: new FormControl(opportunity.DeliveryInstallationStatus__c),
        description: new FormControl(opportunity.Description)
      });
      this.createOpportunity = false;
      this.viewOpportunity = false;
      this.updateOpportunity = true;
    } else {
      this.form = new FormGroup({
        uuid__c: new FormControl(uuidv4(), [Validators.required]),
        isPrivate: new FormControl(''),
        name: new FormControl('', [Validators.required]),
        accountId: new FormControl(''),
        type: new FormControl(''),
        leadSource: new FormControl(''),
        amount: new FormControl('', [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        revenue: new FormControl('', [Validators.pattern('^[0-9]+([.][0-9]+)?$')]),
        closeDate: new FormControl('', [Validators.required]),
        nextStep: new FormControl(''),
        stageName: new FormControl('', [Validators.required]),
        probability: new FormControl('', [Validators.pattern('^(\\d{0,3})$')]),
        campaignId: new FormControl(''),
        orderNumber__c: new FormControl(''),
        currentGenerators__c: new FormControl(''),
        trackingNumber__c: new FormControl(''),
        mainCompetitors__c: new FormControl(''),
        deliveryInstallationStatus__c: new FormControl(''),
        description: new FormControl('')
      });
      this.createOpportunity = true;
    }
  }

  onSubmit(updateOrcreate?: boolean) {
    if (this.form.valid) {
      this.objectToSend = {
        SACAP__UUID__c: this.form.get('uuid__c').value,
        IsPrivate: this.form.get('isPrivate').value,
        Name: this.form.get('name').value,
        AccountId: this.form.get('accountId').value,
        Type: this.form.get('type').value,
        LeadSource: this.form.get('leadSource').value,
        Amount: this.form.get('amount').value,
        ExpectedRevenue: this.form.get('revenue').value,
        CloseDate: this.form.get('closeDate').value,
        NextStep: this.form.get('nextStep').value,
        StageName: this.form.get('stageName').value,
        Probability: this.form.get('probability').value,
        CampaignId: this.form.get('campaignId').value,
        OrderNumber__c: this.form.get('orderNumber__c').value,
        CurrentGenerators__c: this.form.get('currentGenerators__c').value,
        TrackingNumber__c: this.form.get('trackingNumber__c').value,
        MainCompetitors__c: this.form.get('mainCompetitors__c').value,
        DeliveryInstallationStatus__c: this.form.get('deliveryInstallationStatus__c').value,
        Description: this.form.get('description').value,
      };
      if (updateOrcreate) {
        this.loopbackService.patchRequest(this.objectAPI, this.form.get('id').value, this.objectToSend)
          .subscribe((opportunityUpdate: any) => {
            if (opportunityUpdate) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your opportunity has been saved',
                showConfirmButton: false,
                timer: 1500
              }).then(result => window.location.assign(`${window.location.origin}/opportunity/${this.paramID}`));
            }
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
            }).then(result => window.location.assign(`${window.location.origin}/opportunity`));
          }
        }, (error) => console.error('Error ' + error.status + ' - ' + error.name + ' - ' + error.statusText));
      }
    } else {
      this.isInvalid = true;
    }
  }
}
