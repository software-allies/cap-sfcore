# cap-sfcore [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**cap-sfcore** is a module CRUD for **Angular** focused for generic SalesForce objects, such as the following.

* Account
* Contact
* Lead
* Opportunity

---
## **Previous requirements**

In order for your CRUD to work, you must have your own authentication module or use a cap product as [cap-authentication](https://www.npmjs.com/package/cap-authentication) and configure an Auth0 server. When installing this module, you must have `@auth0/angular-jwt` installed to decrypt the user token.
```
npm i @auth0/angular-jwt --save
```

**cap-sfcore** use bootstrap's classes. To be able to display the component in the right way, bootstrap should have been installed in the project. In case you don't have bootstrap installed, you can run the following command or read their [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/download/):
```
npm install bootstrap jquery --save
```
One's that you installed bootstrap you have to configure the `angular.json` and write into `styles`
```
  "styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
  ],
  "scripts": [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js"
  ]
```

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
### **Implementation into a module**

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
### **configure routing**

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
### **HTML tags**

*  **Objects List** => IndexComponent
```
<app-index></app-index>
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
