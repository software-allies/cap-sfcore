# cap-sfcore [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**cap-sfcore** is a module CRUD for **Angular** focused for generic SalesForce objects, such as the following.

* Account
* Contact
* Lead
* Opportunity

---
## Previous requirements

In order for your CRUD to work, you must have your own authentication module or use a cap product as [cap-authentication](https://www.npmjs.com/package/cap-authentication) and configure an Auth0 server. When installing this module, you must have `@auth0/angular-jwt` installed to decrypt the user token.
```
npm i @auth0/angular-jwt --save
```

**cap-sfcore** use bootstrap's classes, You can use a CAP product ([cap-angular-schematic-bootstrap](https://www.npmjs.com/package/cap-angular-schematic-bootstrap)) to configure and install bootstrap to your project the installation is as follows.

```
ng add cap-angular-schematic-bootstrap@latest 4.0.0 true
```
![Alt text](https://raw.githubusercontent.com/software-allies/cap-angular-schematic-auth-auth0/development/assets/images/cap-angular-schematic-bootstrap.png "cap-angular-schematic-bootstrap")

you need to add `ngx-pagination` to the object listing page
```
npm i ngx-pagination --save 
```

you also need to install `uuid` to generate universal unique identifiers for your records since salesForce accepts that fromato of id.
```
npm i uuid --save 
```

Finally, you also have to install `sweetalert2` for some security animations and alerts that will appear when creating a record or also when deleting and confirming the deletion of the record.
```
npm i sweetalert2 --save 
```
---

## Installation
```
npm i cap-sfcore
```
---

## Implementation into a module

To use this module go to the app.module.ts and into the section import and put the cap-sfcore module.
```
import { CapSalesForceCore } from 'cap-sfcore'
```
into the import section
```
@NgModule({
  imports: [
    CapSalesForceCore.forRoot({
      endPoint: '<your endPoint API>'
    })
  ],
})
export class AppModule { }
```

---
## configure routing

Within our angular project we will have a file called `app-routin.module.ts` or in another way, there goes the routing of the components. Now we will modify the routes variable that has defined the routes of the components to have it as follows.
```
// e.g. import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {path: ':object', component: <your index component>},
  // e.g. {path: ':object', component: IndexComponent},

  {path: 'account/create', component: AccountComponent},
  {path: 'account/:id', component: AccountComponent},

  {path: 'contact/create', component: ContactComponent},
  {path: 'contact/:id', component: ContactComponent},

  {path: 'lead/create', component: LeadComponent},
  {path: 'lead/:id', component: LeadComponent},

  {path: 'opportunity/create', component: OpportunityComponent},
  {path: 'opportunity/:id', component: OpportunityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

In the components that you defined of each object will go the selectors (tags) that will render the content of each object, within each one the CRUD can be done.

---
## HTML tags

*  **Objects List** => IndexComponent
```
<app-index-sf></app-index-sf>
```

*  **Account CRUD** => AccountComponent
```
<app-account-sf></app-account-sf>
```

*  **Contact CRUD** => ContactComponent
```
<app-contact-sf></app-contact-sf>
```

*  **Lead CRUD** => LeadComponent
```
<app-lead-sf></app-lead-sf>
```

*  **Opportunity CRUD** => OpportunityComponent
```
<app-opportunity-sf></app-opportunity-sf>
```
---
## Styles

Here we leave some styles already predefined for your application and this package to look cool. You only need to add [these files](https://github.com/software-allies/cap-angular-schematic-responsive/tree/development/src/cap-angular-schematic-responsive/files/src/assets/scss) in your application `/assets/scss`  and import the `main.scss` file in your `src/styles.scss` file in the following way:
```
@import '. /assets/scss/main.scss';
```

You can also do it automatically by calling a schematic for Angular as follows: 

```
ng add cap-angular-schematic-responsive <App title> false false false
```


![Alt text](https://raw.githubusercontent.com/software-allies/cap-angular-schematic-sfcore/development/assets/images/CRUD.png "List")

![Alt text](https://raw.githubusercontent.com/software-allies/cap-angular-schematic-sfcore/development/assets/images/DETAIL.png "List")

