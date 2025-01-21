import { Routes } from '@angular/router';
import { EmailFormComponent } from './components/email-form/email-form.component';

 export const routes: Routes = [
  { path: '', redirectTo: '/send-email', pathMatch: 'full' },
  { path: 'send-email', component: EmailFormComponent },
  { path: '**', redirectTo: '/send-email' }
 ];
