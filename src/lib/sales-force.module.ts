import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoopbackRoutingModule } from './loopback-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfigService } from './services/config.service';
import { LoopbackService } from './services/loopback.service';
import { PaginationComponent } from './components/pagination/pagination.component';

import { IndexComponent } from './components/index/index.component';
import { LeadSFComponent } from './components/lead-sf/lead-sf.component';
import { AccountSFComponent } from './components/account-sf/account-sf.component';
import { ContactSFComponent } from './components/contact-sf/contact-sf.component';
import { OpportunitySFComponent } from './components/opportunity-sf/opportunity-sf.component';

import { IConfig } from './interfaces/config.interface';

import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownListModule } from 'ngx-dropdown-list';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    IndexComponent,
    LeadSFComponent,
    AccountSFComponent,
    ContactSFComponent,
    PaginationComponent,
    OpportunitySFComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    
    DropdownListModule,
    NgSelectModule,
    
    ReactiveFormsModule,
    NgxPaginationModule,
    LoopbackRoutingModule,
    BrowserAnimationsModule,
  ],
  exports: [
    IndexComponent,
    LeadSFComponent,
    AccountSFComponent,
    ContactSFComponent,
    PaginationComponent,
    OpportunitySFComponent
  ],
  providers: [LoopbackService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CapSalesForceCore {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: CapSalesForceCore,
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
      ]
    };
  }
}
