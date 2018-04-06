import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { PhotoComponent } from './photo/photo.component';
import { ResultComponent } from './result/result.component';
import { ShareComponent } from './share/share.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'photo', component: PhotoComponent },
  { path: 'result', component: ResultComponent },
  { path: 'share', component: ShareComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
