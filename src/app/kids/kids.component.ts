import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { KidsDialogComponent } from '../dialogs/kids.dialog/kids.dialog.component';
declare var $: any;
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css']
})
export class KidsComponent implements OnInit {
  kids: any;
  queryKids$ = new Subject<string>();
  hasKids = true;

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private modalService: NgbModal,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    // Build query to get my kids
    this.kids = this.queryKids$.switchMap(uid =>
      this.db.collection('/kids', ref => ref.where('parent', '==', uid)).valueChanges()
    );
    // Get my kids
    this.afAuth.authState.subscribe(
      user => {
        this.queryKids$.next(user.uid);
      }
    );

    // Hide spinner when kids are loaded
    this.kids.subscribe(
      kids => {
        this.loaderService.hideLoader();
        this.hasKids = kids.length > 0;
      }
    );
  }

  addKid() {
    const modalRef = this.modalService.open(KidsDialogComponent, { size: 'lg' });
    // modalRef.componentInstance.kidData = 'World';
    modalRef.result.then(
      (kid) => {
        this.loaderService.hideLoader();
        Swal('Exito', `${kid.name} agregado correctamente`, 'success');
      },
      (dismissed) => {
        console.log(dismissed);
      }
    );
  }

}
