import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoopbackService } from '../../services/loopback.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-opportunity-sf',
  templateUrl: './opportunity-sf.component.html',
  styles: [`
    .col-width-35 {
      width: 35%;
    }

    .col-width-25 {
      width: 25%;
    }

    .col-width-15{
      width: 17%; 
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

  accountsName: string[] = [];
  contactsName: string[] = [];
  limit: number = 10;
  config = {
    displayKey: "description", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
    limitTo: this.limit, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr' // the direction of the search input can be rtl or ltr(default)
  }
  accountIDSalesforce: string = '';
  contactIDSalesforce: string = '';
  currentAccount: string = '';
  currentContact: string = '';

  contactName: string = '';
  
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
    this.status = false;

    this.opportunity = {};
    this.objectToSend = {};
    this.lookUpAccount = null;
    this.lookUpContact = null;
  }

  ngOnInit() {
    if (this.location.prepareExternalUrl(this.location.path()).split('/')[2] === 'create') {
      this.createForm();
      console.log('contactName: ', this.contactName);
    } else {
      this.activateRoute.params.subscribe((params: { id: string, status?: string }) => {
        this.getObject(params.id);
        this.status = params.status === 'update' ? true : false;
      });
    }
    this.getLookUps();
  }

  getObject(sfid: string) {
    this.loopbackService.getRecordWithFindOne(this.objectAPI, sfid).subscribe((object: any) => {
      this.opportunity = object;
      let accountN = this.LookUpAccountName(this.opportunity.AccountId);
      this.currentAccount = accountN ? accountN : '';
      let contactN = this.LookUpCampaignId(this.opportunity.CampaignId);
      this.currentContact = contactN ? contactN : '';
      this.viewOpportunity = object ? true : false;
      if (this.status) {
        this.createForm(object);
      }
    });
  }

  getLookUps() {
    this.loopbackService.getLookUp('Accounts').subscribe((accounts: Array<{ any }>) => {
      this.lookUpAccount = accounts;
      this.accountsName = this.lookUpAccount.map(account => account.Name)
    });
    this.loopbackService.getLookUp('Contacts').subscribe((contacts: Array<{ any }>) => {
      this.lookUpContact = contacts;
      
      this.contactsName = this.lookUpContact.map(contact => {
        console.log('this.contactsName: ', this.contactsName);
        if(contact.SfId === this.opportunity.CampaignId){
          console.log('contact.SfId: ', contact.SfId);
          console.log('contactName: ', this.contactName);
          this.contactName = contact.Name;

        }
        let data = {
          id: contact.id, 
          value: contact.SfId, 
          text: contact.Name
        }

        return data;
      })
      console.log('this.contactsName: ', this.contactsName);
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

  changeFormatDate(formatDate: any): string {
    const date = new Date(formatDate);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    return date.getUTCFullYear() + '-' + month + '-' + day;
  }

  LookUpAccountName(id: string): string {
    if (this.lookUpContact && id && this.lookUpAccount) {
      let fromContact = this.lookUpContact.find(contact => contact.AccountId === id);
      let fromaAccount = this.lookUpAccount.find(account => account.SfId === id);
      if (fromContact === undefined && fromaAccount === undefined) {
        return ''
      }
      let accountName = fromContact ? fromContact.Name : fromaAccount.Name;
      this.currentAccount = accountName;
      return accountName ? accountName : '';
    }
  }

  LookUpCampaignId(CampaignId: string): string {
    if (CampaignId === null) CampaignId = '';

    if (this.lookUpContact && CampaignId) {
      const contact = this.lookUpContact.find(x => x.SfId === CampaignId).Name;
      if (contact) {
        this.currentContact = contact;
        return this.currentContact;
      }
      return '';
    }
    return '';
  }

  createForm(opportunity?: any) {
    if (opportunity) {
      this.form = new FormGroup({
        id: new FormControl(opportunity.id, [Validators.required]),
        uuid__c: new FormControl(opportunity.SACAP__UUID__c, [Validators.required]),
        isPrivate: new FormControl(opportunity.IsPrivate),
        name: new FormControl(opportunity.Name, [Validators.required]),
        accountName: new FormControl(this.currentAccount ? this.currentAccount : ''),
        contactName: new FormControl(this.currentContact ? this.currentContact : ''),
        accountId: new FormControl(opportunity.AccountId),
        type: new FormControl(opportunity.Type),
        leadSource: new FormControl(opportunity.LeadSource),
        amount: new FormControl(opportunity.Amount, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        revenue: new FormControl(opportunity.ExpectedRevenue, [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
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
        amount: new FormControl('', [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
        revenue: new FormControl('', [Validators.pattern('^(\\d*|\\d+\\.\\d{1,2})$')]),
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
    
    if (!this.contactIDSalesforce || this.contactIDSalesforce === null) {
      this.contactIDSalesforce = this.opportunity.CampaignId;
    }
    if (!this.accountIDSalesforce || this.accountIDSalesforce === null) {
      this.accountIDSalesforce = this.opportunity.AccountId;
    }

    if (this.form.valid) {
      this.objectToSend = {
        SACAP__UUID__c: this.form.get('uuid__c').value,
        IsPrivate: this.form.get('isPrivate').value,
        Name: this.form.get('name').value,
        AccountId: this.accountIDSalesforce,
        Type: this.form.get('type').value,
        LeadSource: this.form.get('leadSource').value,
        Amount: this.form.get('amount').value,
        ExpectedRevenue: this.form.get('revenue').value,
        CloseDate: this.form.get('closeDate').value,
        NextStep: this.form.get('nextStep').value,
        StageName: this.form.get('stageName').value,
        Probability: this.form.get('probability').value,
        CampaignId: this.contactIDSalesforce,
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
              }).then(result => window.location.assign(`${window.location.origin}/opportunity`));
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
            }).then(result => window.location.assign(`${window.location.origin}/opportunity`));
          }
        });
      }
    } else {
      this.isInvalid = true;
    }
  }

  selectionAccountChanged(event: any) {
    let name = event.value
    if (name) this.accountIDSalesforce = this.lookUpAccount.find(account => account.Name === name).SfId;
    return ''
  }

  selectionContactChanged(event: any) {
    console.log('event: ', event);
    return this.contactIDSalesforce = event ? event : ''
    
  }

}
