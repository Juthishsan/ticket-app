import { Routes } from '@angular/router';
import { CustomerViewComponent } from './components/customer-view/customer-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { LoginComponent } from './components/login/login.component';
import { TicketChatComponent } from './components/ticket-chat/ticket-chat.component';
import { authGuard } from './guards/auth.guard';

import { RoleSelectionComponent } from './components/role-selection/role-selection.component';

export const routes: Routes = [
  { path: '', component: RoleSelectionComponent },
  { path: 'customer', component: CustomerViewComponent },
  { path: 'track', component: TicketChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminViewComponent, canActivate: [authGuard] }
];
