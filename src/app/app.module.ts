import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BootstrapRootModule} from './page/bootstrap.modules';
import {PageModule} from './page/page.module';
import {BioDareEndPoints, bioDareRestConfigurator} from './backend/biodare-rest.dom';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {FeedbackModule} from './feedback/feedback.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {StaticContentModule} from './documents/static-content/static-content.module';
import {SharedDialogsModule} from './shared/shared-dialogs/shared-dialogs.module';

const endPoints: BioDareEndPoints = bioDareRestConfigurator(environment);


@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        BootstrapRootModule,
        MatSidenavModule,
        SharedDialogsModule,
        StaticContentModule,
        PageModule,
        FeedbackModule,
        AppRoutingModule], providers: [
        { provide: BioDareEndPoints, useValue: endPoints },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
