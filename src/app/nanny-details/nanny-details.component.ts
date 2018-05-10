import { ChangeDetectorRef, ComponentFactoryResolver, Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { LoaderService } from '../services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import Swal from 'sweetalert2';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';
const now = new Date();
@Component({
  selector: 'app-nanny-details',
  templateUrl: './nanny-details.component.html',
  styleUrls: ['./nanny-details.component.css']
})
export class NannyDetailsComponent implements OnInit {
  nanny;
  nannyAsync;
  reviews;
  stars;
  reviewUser;
  remainingStars;
  categories;
  queryNannys$ = new Subject<string>();
  queryReviews$ = new Subject<string>();
  queryUser$ = new Subject<string>();
  Observable = Observable;
  startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  startTime = { hour: now.getHours() + 1, minute: now.getMinutes()};
  endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  endTime = { hour: now.getHours() + 3, minute: now.getMinutes() };

  isCollapsed = true;

  constructor(private db: AngularFirestore,
              private loaderService: LoaderService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private resolver: ComponentFactoryResolver,
              private injector: Injector) { }

  ngOnInit() {
    this.loaderService.showLoader();

    // Queries
    this.nannyAsync = this.queryNannys$.switchMap(name =>
      this.db.collection('/nannys', ref => ref.where('name', '==', name)).snapshotChanges()
        .map(changes => {
          return changes.map(change => {
            const data = change.payload.doc.data();
            const id = change.payload.doc.id;
            return { id, ...data };
          });
        })
    );

    this.reviews = this.queryReviews$.switchMap(nanny =>
      this.db.collection('/reviews', ref => ref.where('nanny', '==', nanny)).snapshotChanges()
        .map(changes => {
          return changes.map(change => {
            const data = change.payload.doc.data();
            this.db.collection('/users').snapshotChanges()
              .map(
                usersChanges => {
                  return usersChanges.filter(userChange => data.user === userChange.payload.doc.id);
                }
              )
              .map(users => users[0].payload.doc.data())
              .subscribe(user => data.user = user);
            delete data.nanny;
            return data;
          });
        })
    );

    // Subscriptions to the queries
    this.nannyAsync.subscribe(
      nanny => {
        this.nanny = nanny[0];
        this.queryReviews$.next(this.nanny.id);
        this.stars = Observable.range(0, this.nanny.stars).toArray();
        this.remainingStars = Observable.range(0, 5 - this.nanny.stars).toArray();
        this.db.collection('/categories').valueChanges().subscribe(
          categories => {
            const temp = [];
            for (const category of this.nanny.categories) {
              const index = categories.map((obj) => (<any>obj).value).indexOf(category);
              if (index > -1) {
                temp.push(categories[index]);
              }
            }
            this.categories = temp;
            this.cdr.detectChanges();
            this.loaderService.hideLoader();
          }
        );
      }
    );

    this.queryNannys$.next(this.route.snapshot.paramMap.get('name'));
  }

  openPayDialog() {
    const factory = this.resolver.resolveComponentFactory(PaypalButtonComponent);
    const component = factory.create(this.injector);
    component.instance.price = this.calculateTotal();
    component.changeDetectorRef.detectChanges();
    Swal({
      title: 'Contratar',
      html: component.location.nativeElement,
      confirmButtonColor: '#ff94cc',
      confirmButtonText: 'Cancelar'
    });
  }

  calculateTotal() {
    if (this.nanny) {
      const start = new Date(
        this.startDate.year,
        this.startDate.month,
         this.startDate.day,
         this.startTime.hour,
         this.startTime.minute,
         0,
         0).getTime();
      const end = new Date(this.endDate.year, this.endDate.month, this.endDate.day, this.endTime.hour, this.endTime.minute, 0, 0).getTime();
      return (Math.abs(end - start) / 36e5) * this.nanny.price;
    }
  }

}
