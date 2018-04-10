import { ChangeDetectorRef, Component, EventEmitter, Input, Inject, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { WebCamComponent } from 'ack-angular-webcam';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { LoaderService } from '../../services/loader.service';
import { Kid } from '../../models/kid.model';
@Component({
  selector: 'app-kids-dialog',
  templateUrl: './kids.dialog.component.html',
  styleUrls: ['./kids.dialog.component.css']
})
export class KidsDialogComponent implements OnInit {
  title: String = 'Agregar Hijo';
  icon: String = 'fas fa-child';
  edit: Boolean = false;
  triedToSubmit = false;
  data: any = { image: '/assets/img/avatar-default.png' };
  cropperSettings: CropperSettings = new CropperSettings();
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  displayCropper = false;
  webcam: WebCamComponent;
  displayWebcam = false;

  kidForm = new FormGroup({
    photo: new FormControl(),
    name: new FormControl(),
    birthdate: new FormControl()
  });

  user;
  formValid = true;
  // public dialogRef: MatDialogRef<KidsDialogComponent>,
  // @Inject(MAT_DIALOG_DATA) public kidData: any
  constructor(public activeModal: NgbActiveModal,
              public afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.cropperSettings.width = 250;
    this.cropperSettings.height = 250;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 250;
    this.cropperSettings.canvasHeight = 250;
    this.cropperSettings.rounded = true;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.keepAspect = true;

    this.afAuth.authState.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  onChange($event: any): void {
    this.displayCropper = true;
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const cropper = this.cropper;
    myReader.addEventListener('loadend', (loadEvent: any) => {
      image.src = loadEvent.target.result;
      cropper.setImage(image);
    });

    myReader.readAsDataURL(file);
  }

  showWebcam(): void {
    this.displayWebcam = true;
  }

  saveImage(): void {
    this.displayCropper = false;
    this.kidForm.get('photo').setValue(this.data.image);
  }

  saveImageWebcam(): void {
    this.webcam.getBase64()
      .then(base64 => {
        const image: any = new Image();
        image.src = base64;
        this.cropper.setImage(image);
        this.displayWebcam = false;
        this.displayCropper = true;
      })
      .catch(e => console.error(e));
  }

  onCamError(err): void {
    console.error(err);
  }

  onSubmit(kidForm) {
    if (kidForm.valid) {
      this.formValid = true;
      const kid: Kid = kidForm.value;
      // this.dialogRef.close(kidForm.value);
      this.loaderService.showLoader();
      kid.parent = this.user.uid;
      this.db.collection<Kid>('/kids').add(kid).then(
        kidInserted => {
          this.activeModal.close(kid);
        }
      );
    } else {
      this.formValid = false;
    }
  }

}
