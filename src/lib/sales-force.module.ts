import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IConfig } from './interfaces/config.interface';
import { ConfigService } from './services/config.service';
import { LoopbackRoutingModule } from './loopback-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoopbackService } from './services/loopback.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { IndexComponent } from './components/index/index.component';
import { AccountSFComponent } from './components/account-sf/account-sf.component';
import { ContactSFComponent } from './components/contact-sf/contact-sf.component';
import { LeadSFComponent } from './components/lead-sf/lead-sf.component';
import { OpportunitySFComponent } from './components/opportunity-sf/opportunity-sf.component';

@NgModule({
  declarations: [
    PaginationComponent,
    IndexComponent,
    AccountSFComponent,
    ContactSFComponent,
    LeadSFComponent,
    OpportunitySFComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    LoopbackRoutingModule
  ],
  exports: [
    PaginationComponent,
    IndexComponent,
    AccountSFComponent,
    ContactSFComponent,
    LeadSFComponent,
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
