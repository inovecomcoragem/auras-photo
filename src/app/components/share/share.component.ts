import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { UserService } from '../../providers/user.service';
import { User } from '../../models/user.model';

declare var QRCode: any;


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})

export class ShareComponent implements OnInit {
  user: User;

  @ViewChild('qrCanvas') qrCanvas: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.user = this.userService.user;

      const userURL = environment.resultURL + '/' + this.user.code;
      const canvasElement = this.qrCanvas.nativeElement;

      QRCode.toCanvas(canvasElement,
                      userURL,
                      { errorCorrectionLevel: 'H', version: 4 },
                      function(error) {
                        canvasElement.style.width = '200px';
                        canvasElement.style.height = '200px';
      });

      // TODO: send image back to backend
    }
  }
}
