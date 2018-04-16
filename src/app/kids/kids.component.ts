import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { KidsDialogComponent } from '../dialogs/kids.dialog/kids.dialog.component';
declare var $: any;
import { LoaderService } from '../services/loader.service';
import 'rxjs/add/operator/map';
import { Kid } from '../models/kid.model';
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
      this.db.collection('/kids', ref => ref.where('parent', '==', uid)).snapshotChanges()
      .map(changes => {
        return changes.map(change => {
          const data = change.payload.doc.data();
          const id = change.payload.doc.id;
          return {id, ...data};
        });
      })
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

  showEditKid(kid, index) {
    if (this.buttonsAreVisible(index)) {
      const modalRef = this.modalService.open(KidsDialogComponent, { size: 'lg' });
      modalRef.componentInstance.kidData = kid;
      modalRef.result.then(
        (kidEdited) => {
          console.log(kidEdited);
          this.loaderService.hideLoader();
          Swal('Exito', `${kidEdited.name} editado correctamente`, 'success');
        },
        (dismissed) => {
          console.log(dismissed);
        }
      );
    }
  }

  showDeleteKid(kid, index) {
    if (this.buttonsAreVisible(index)) {
      Swal({
        title: '¿Estás seguro?',
        text: `${kid.name} será eliminado permanentemente`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff94cc',
        cancelButtonColor: '#27253f',
        confirmButtonText: '¡Si, Eliminalo!'
      }).then((result) => {
        if (result.value) {
          this.loaderService.showLoader();
          this.db.doc<Kid>(`/kids/${kid.id}`).delete().then(
            kidDeleted => {
              this.loaderService.hideLoader();
              Swal(
                '¡Eliminado!',
                `${kid.name} eliminado correctamente`,
                'success'
              );
            }
          );
        }
      });
    }
  }

  buttonsAreVisible(index) {
    return $('.overlay').eq(index).css('opacity') === '1';
  }

}
