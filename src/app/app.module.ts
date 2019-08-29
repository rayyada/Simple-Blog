import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from './auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './app-material/app-material.module';
import { JwtHelperService  } from '@auth0/angular-jwt';
import { AuthenticationCallbackComponent } from './authentication-callback/authentication-callback.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogFormComponent } from './blog-list/blog-form/blog-form.component';
import { BlogListService } from './blog-list/blog-list.service';
import { InterceptorService } from './interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AuthenticationCallbackComponent,
    ProfileComponent,
    BlogListComponent,
    BlogFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AppMaterialModule,
  ],
  providers: [AuthService, 
    JwtHelperService,
    BlogListService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
