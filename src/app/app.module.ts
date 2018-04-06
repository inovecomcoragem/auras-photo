import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { PhotoComponent } from './photo/photo.component';
import { ResultComponent } from './result/result.component';
import { ShareComponent } from './share/share.component';


import { UserService } from './user.service';


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
