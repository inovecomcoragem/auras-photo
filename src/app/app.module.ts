import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { PhotoComponent } from './components/photo/photo.component';
import { ResultComponent } from './components/result/result.component';
import { ShareComponent } from './components/share/share.component';


import { UserService } from './providers/user.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PhotoComponent,
    ResultComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
