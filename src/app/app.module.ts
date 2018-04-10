import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { PhotoComponent } from './components/photo/photo.component';
import { ResultComponent } from './components/result/result.component';
import { ShareComponent } from './components/share/share.component';

import { SensorService } from './providers/sensor.service';
import { PhotoService } from './providers/photo.service';
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
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    SensorService,
    PhotoService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
