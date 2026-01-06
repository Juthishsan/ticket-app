import { Routes } from '@angular/router';
import { CustomerViewComponent } from './components/customer-view/customer-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customer', pathMatch: 'full' },
  { path: 'customer', component: CustomerViewComponent },
  { path: 'admin', component: AdminViewComponent }
];
