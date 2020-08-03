import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoopbackRoutingModule } from './loopback-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxPaginationModule } from 'ngx-pagination';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { ConfigService } from './services/config.service';
import { LoopbackService } from './services/loopback.service';
import { PaginationComponent } from './components/pagination/pagination.component';

import { IndexComponent } from './components/index/index.component';
import { LeadSFComponent } from './components/lead-sf/lead-sf.component';
import { AccountSFComponent } from './components/account-sf/account-sf.component';
import { ContactSFComponent } from './components/contact-sf/contact-sf.component';
import { OpportunitySFComponent } from './components/opportunity-sf/opportunity-sf.component';

import { IConfig } from './interfaces/config.interface';

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
    ReactiveFormsModule,
    NgxPaginationModule,
    SelectDropDownModule,
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
  providers: [LoopbackService]
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
