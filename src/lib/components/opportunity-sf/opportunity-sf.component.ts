import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import Uuidv4 from 'uuid/v4';

@Component({
  selector: 'app-opportunity-sf',
  templateUrl: './opportunity-sf.component.html',
  styles: [``]
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

  opportunity: any;
  objectToSend: any;

  lookUpAccount: any;
  lookUpContact: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private loopbackService: LoopbackService
  ) {
    this.isInvalid = false;
    this.objectAPI = 'Opportunitys';

    this.createOpportunity = false;
    this.updateOpportunity = false;
    this.viewOpportunity = false;

    this.opportunity = {};
    this.objectToSend = {};
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
      this.opportunity = object;
      this.viewOpportunity = object ? true : false;
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
      this.router.navigate([`/opportunity`]);
    } else {
      this.viewOpportunity = true;
      this.createOpportunity = false;
      this.updateOpportunity = false;
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

  createForm(opportunity?: any) {
    if (opportunity) {
      this.form = new FormGroup({
        id: new FormControl(opportunity.id, [Validators.required]),
        uuid__c: new FormControl(opportunity.UUID__c, [Validators.required]),
        isPrivate: new FormControl(opportunity.IsPrivate),
        name: new FormControl(opportunity.Name, [Validators.required]),
        accountId: new FormControl(opportunity.AccountId),
        type: new FormControl(opportunity.Type),
        leadSource: new FormControl(opportunity.LeadSource),
        amount: new FormControl(opportunity.Amount, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
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
        uuid__c: new FormControl(Uuidv4(), [Validators.required]),
        isPrivate: new FormControl(''),
        name: new FormControl('', [Validators.required]),
        accountId: new FormControl(''),
        type: new FormControl(''),
        leadSource: new FormControl(''),
        amount: new FormControl('', [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
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
        UUID__c: this.form.get('uuid__c').value,
        IsPrivate: this.form.get('isPrivate').value,
        Name: this.form.get('name').value,
        AccountId: this.form.get('accountId').value,
        Type: this.form.get('type').value,
        LeadSource: this.form.get('leadSource').value,
        Amount: this.form.get('amount').value,
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
            }).then(result => this.router.navigate([`/opportunity`]));
          }
        });

      } else {
        this.loopbackService.postRequest(this.objectAPI, this.objectToSend).subscribe((opportunity: any) => {
          if (opportunity) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your opportunity has been saved',
              showConfirmButton: false,
              timer: 1500
            }).then(result => this.router.navigate([`/opportunity`]));
          }
        });
      }
    } else {
      this.isInvalid = true;
    }
  }
}
