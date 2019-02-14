import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeDashboardService } from './services/home-dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgDragDropModule } from 'ng-drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeDashboardComponent
  ],
  imports: [
    BrowserModule, RouterModule, AppRoutingModule, HttpClientModule, FormsModule, Ng2SearchPipeModule, ReactiveFormsModule,
    NgDragDropModule.forRoot(), NgxPaginationModule, MatPaginatorModule,
    FormsModule,
    AppRoutingModule,BrowserAnimationsModule
  ],exports: [
    CdkTableModule,
  BrowserAnimationsModule,MatPaginatorModule
  ],
  providers: [HomeDashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
