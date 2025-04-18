import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { UploadComponent } from './features/upload/upload.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'upload',
    component: UploadComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
