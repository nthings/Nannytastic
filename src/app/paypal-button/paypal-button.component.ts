import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
declare let paypal: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit, AfterViewChecked {
  @Input()
  price;

  didPaypalScriptLoad: Boolean = false;

  date;

  paypalConfig: any = {
    env: 'sandbox',
    client: {
      sandbox: 'AboF0MDXP1-5QwQaHsxqlThhBuYHx3rKycr1Q6y7gH5PdbKm3eqMSIv93ybmYauEY5qsE8I9oslPn15z',
      production: 'xxxxxxxxxx'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.price, currency: 'MXN' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        // show success page
        Swal('Si!', 'Tu niñera va en camino', 'success');
      });
    }
  };

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    if (!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button');
      });
    }
  }

  loadPaypalScript(): Promise<any> {
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

}
