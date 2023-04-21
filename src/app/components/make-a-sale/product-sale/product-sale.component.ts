import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrls: ['./product-sale.component.css']
})
export class ProductSaleComponent implements OnInit {

  ADD_VOUCHER_FORM: FormGroup;
  SEARCH_TEXT: string = "";
  SERVICE_SEARCH_TEXT: string = "";
  STOCK_FILETR: any = 0;
  PRICE_FILETR: any = 1;
  DISCOUNT_COUPON: any = 0;
  DISCOUNT_COUPON_PERCENTAGE: any = 10;
  SUB_TOTAL: any = 0;
  SALES_TAX: any = 0;
  SALES_TAX_PERCENTAGE: any = 23;
  SERVICE_IMAGE: string = "../../../../assets/img/service.jpeg";
  VOUCHER_IMAGE: string = "../../../../assets/img/voucher.jpeg";
  TOTAL_PAYMENT: any = 0;
  PRODUCT_LIST: any = [];
  SERVICE_LIST: any = [];
  SERVICE_CATEGORY_LIST: any = [];
  PRODUCT_RESPONSE: any = [];
  SERVICE_RESPONSE: any = [];
  IS_CASH_PAYMENT_ACTIVE: boolean = false;
  CART_LIST: any = [];
  MODEL_OPEN: boolean = false;
  MODEL_MESSAGE: string = '';
  STRIPE_CHARGE_RESPONSE:any = '';
  BRAND_LIST: any = [ 
                      {id: 0 , name: "All" , is_active : true } ,
                      {id: 1 , name: "Shoes" , is_active : false }, 
                      {id: 2 , name: "T-shirt" , is_active : false }, 
                    ];

  CURRENT_TAB: string = 'Products';

  TAB_LIST = [ 
    { id: 1 , is_active: true, value: 'Products' },
    { id: 2 , is_active: false, value: 'Services' },
    { id: 3 , is_active: false, value: 'Vouchers' },
  ];
  
  TOKEN: string = '';


  constructor(
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private staffService: ConfigStaffService,
    private fb: FormBuilder ,) {

      this._getProducts();
      this._getServices();
      this._getServiceCategory();
      this._initiateVoucherForm();
  }

  ngOnInit() {
    this.loadStripe();
  }

  loadStripe() {
      
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
  }

  pay(amount) {    
  
    //let [amounts , float_numb] = amount.split('.');
    amount = amount * 100;
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LonaPHrqYp23LTOaGG8jWkMsITXNGuJ7vRIvKo28blmVx9C7XtcBT0bfOufKQvfJU6FUNZbiHfgA9cOAfLlMKN300JZWgyFVd',
      locale: 'auto',
      token:  async(token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
       
        this.TOKEN = token.id;
        console.log('this.TOKEN-----' , this.TOKEN)
        console.log('token-----' , token)

        let product_cart_item = await this.CART_LIST.filter(data => data.itemType == 'product');
        let description_text = '';

        if (product_cart_item.length > 0) {

          description_text += 'Product : ';
          let p_item = [];

          for (let value of product_cart_item) p_item.push(value.name);
          description_text += p_item.join(' , ') +"; ";
        }

        let service_cart_item = await this.CART_LIST.filter(data => data.itemType == 'service');
        
        if (service_cart_item.length > 0) {

          description_text += 'Service : ';
          let s_item = [];
          for (let value of service_cart_item)  s_item.push(value.serviceName);
          description_text += s_item.join(' , ')+" ; ";
        }

        let voucher_cart_item = await this.CART_LIST.filter(data => data.itemType == 'voucher');
        
        if (voucher_cart_item.length > 0) {

          description_text += 'Voucher : ';
          let v_item = [];
          for (let value of voucher_cart_item)  v_item.push(value.voucherSerialNumber);
          description_text += v_item.join(' , ')+" ; ";
        }

        let form_data = new FormData();
        form_data.append('email' , token.email);
        form_data.append('token' , token.id);
        form_data.append('amount' , amount);
        form_data.append('description' , description_text);

        this._createCharge(form_data);
      }
    });
  
    handler.open({
      name: 'Jade Amber',
      description: 'Make a sale',
      amount: amount,
      currency: "eur"
    });
  
  }


  async _initiateVoucherForm () {

    this.ADD_VOUCHER_FORM =   await this.fb.group({

      firstName: ['', Validators.required],
      sirName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      no_details_provided: [false],
      voucher_serial_number: ['jade1025', Validators.required],
      description: ['', Validators.required],
      voucher_amount: ['', Validators.required],
      email_voucher: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      client_same_email: [false],
    });

    await this.changeDetection.detectChanges();
  }

  

  async _getProducts () {

    await this.spinner.show();
    await (await this.staffService._getProducts()).subscribe(
      async (response: any ) => {
        
        for ( let product of response) product['itemType'] = 'product'; 
        
        this.PRODUCT_RESPONSE = response;
        this.PRODUCT_LIST = response;
        this._searchFilter()
        this.changeDetection.detectChanges();
        await this.spinner.hide();
      },
      async (error: any) => {
        
        await this.spinner.hide();
      }
    );
  }

  async _getServices () {

    await (await this.staffService._getServices()).subscribe(
      async (response: any ) => {
        
        for ( let product of response) {
          product['itemType'] = 'service'; 
          product['image'] = this.SERVICE_IMAGE; 
        }
        
        this.SERVICE_RESPONSE = response;
        this.SERVICE_LIST = response;
        this.changeDetection.detectChanges();
      
      },
      async (error: any) => {
      }
    );
  }

  async _getServiceCategory () {

    await (await this.staffService._getServiceCategory()).subscribe(
      async (response: any ) => {
       
        
        for (let category of response) category.is_active = false;

        
        this.SERVICE_CATEGORY_LIST = [{id:0 , categoryName: 'All' , is_active: true} , ...response];
        this.changeDetection.detectChanges();
        
      },
      async (error: any) => {
      }
    );
  }


  async _clearFilter() {

    this.SEARCH_TEXT = '';
    this.STOCK_FILETR = 0;
    this.PRICE_FILETR = 1;
    await this._searchFilter();
    await this.changeDetection.detectChanges();
  }

  async _clearServiceFilter() {

    this.SERVICE_SEARCH_TEXT = '';
    await this._searchServiceFilter();
    await this.changeDetection.detectChanges();
  }


  async _selectBrand (index: any) {

    for (let brand of this.BRAND_LIST) brand.is_active = false;
    this.BRAND_LIST[index]['is_active'] = true;
    this.PRODUCT_LIST = index != 0 ? await  this.PRODUCT_RESPONSE.filter( data => data.brandId == this.BRAND_LIST[index]['id']) : this.PRODUCT_RESPONSE;
    
    await this._searchFilter();
    await this.changeDetection.detectChanges();
  }

  async _selectCategory (index) {

    for (let category of this.SERVICE_CATEGORY_LIST ) category.is_active = false;
    this.SERVICE_CATEGORY_LIST[index]['is_active'] = true;
    this.SERVICE_LIST = index != 0 ? await  this.SERVICE_RESPONSE.filter( data => data.categoryId == this.SERVICE_CATEGORY_LIST[index]['id']) : this.SERVICE_RESPONSE;
    
    await this._searchServiceFilter();
    await this.changeDetection.detectChanges();
  }

  async _addToCart(product_id: any) {

    let is_exist_in_cart = await this.CART_LIST.filter( data => data.id == product_id);

    if (is_exist_in_cart.length  == 0) {
      
      let get_product = await this.PRODUCT_LIST.filter( data => data.id == product_id);

      if (get_product.length > 0) {

        get_product = get_product[0];
        get_product['no_of_item'] = 1;

        this.CART_LIST.push(get_product);
      }
    }
    
    await this._calculatePrice();
    await this.changeDetection.detectChanges();
  }

  async _addServiceToCart (service_id: any) {

    let is_exist_in_cart = await this.CART_LIST.filter( data => data.id == service_id );

    if (is_exist_in_cart.length  == 0) {
      
      let get_service = await this.SERVICE_LIST.filter( data => data.id == service_id );

      if (get_service.length > 0) {

        get_service = get_service[0];
        get_service['no_of_item'] = 1;
        get_service['price'] = get_service['servicePrice'];

        this.CART_LIST.push(get_service);
      }
    }

    console.log('cart-----' , this.CART_LIST)
    
    await this._calculatePrice();
    await this.changeDetection.detectChanges();
  }

  async _searchFilter () {

    let get_selected_brand = await this.BRAND_LIST.filter( data => data.is_active);
    let brand_id = get_selected_brand.length > 0 ? get_selected_brand[0].id : 0;

    this.PRODUCT_LIST =  brand_id !=0 ?  await this.PRODUCT_RESPONSE.filter( data => data.brandId == brand_id) : this.PRODUCT_RESPONSE;

    console.log('this.PRODUCT_LIST---------' , this.PRODUCT_LIST);

    if (this.SEARCH_TEXT != '') {

      this.PRODUCT_LIST = await this.PRODUCT_LIST.filter( data => 
        ((data.name.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1)
        ||
        ((data.description.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1)
        );
    }

    if (this.STOCK_FILETR != 0) {

      if (this.STOCK_FILETR == 1) {

        //In stock
        this.PRODUCT_LIST = await this.PRODUCT_LIST.filter( data => data.quantity > 5);
      } 
      else if (this.STOCK_FILETR == 2) {

        //Out of stock
        this.PRODUCT_LIST = await this.PRODUCT_LIST.filter( data => data.quantity == 0);
      } else {
        //Out of stock
        this.PRODUCT_LIST = await this.PRODUCT_LIST.filter( data => data.quantity <= 5 && data.quantity > 0);
      }
    }

    if (this.PRICE_FILETR != 0) {

      console.log('price')
      if (this.PRICE_FILETR == 1) {
        
        await this.PRODUCT_LIST.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else {
        await this.PRODUCT_LIST.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
    }

    console.log('check--' , this.PRODUCT_LIST)

    //this.PRODUCT_LIST = this.PRODUCT_LIST.sort((a , b) => b.hot - a.hot); // sort array based hot key

    await this.changeDetection.detectChanges();
  }

  async _searchServiceFilter () {

    let get_selected_service_category = await this.SERVICE_CATEGORY_LIST.filter( data => data.is_active);
    let service_category_id = get_selected_service_category.length > 0 ? get_selected_service_category[0].id : 0;
    this.SERVICE_LIST =  service_category_id !=0 ?  await this.SERVICE_RESPONSE.filter( data => data.categoryId == service_category_id) : this.SERVICE_RESPONSE;

    if (this.SERVICE_SEARCH_TEXT != '') {

      this.SERVICE_LIST = await this.SERVICE_LIST.filter( data => 
        ((data.serviceName.toLocaleLowerCase()).indexOf(this.SERVICE_SEARCH_TEXT.toLocaleLowerCase()) != -1)
        ||
        ((data.serviceDescription.toLocaleLowerCase()).indexOf(this.SERVICE_SEARCH_TEXT.toLocaleLowerCase()) != -1)
        );
    }

    await this.changeDetection.detectChanges();
  }

  async _cartProductItemChange (index: any , value_type: string) {

    this.CART_LIST[index]['no_of_item'] = value_type == 'increment' ? ++this.CART_LIST[index]['no_of_item'] : --this.CART_LIST[index]['no_of_item'];
    this.CART_LIST = await this.CART_LIST.filter( data => data.no_of_item > 0);
    this._calculatePrice();
    await this.changeDetection.detectChanges();
  }

  async _calculatePrice () {

    this.SUB_TOTAL = 0;
    for (let value of this.CART_LIST) this.SUB_TOTAL += (value.price * value.no_of_item);
    await this.changeDetection.detectChanges();

    if (this.SUB_TOTAL == 0) {

      this.TOTAL_PAYMENT = 0;
      this.DISCOUNT_COUPON = 0;
      this.SALES_TAX = 0;
    } else {

      
      this.DISCOUNT_COUPON = (this.SUB_TOTAL * this.DISCOUNT_COUPON_PERCENTAGE)/100;
     
      this.TOTAL_PAYMENT = this.SUB_TOTAL  - this.DISCOUNT_COUPON;
      this.SALES_TAX = (this.TOTAL_PAYMENT * this.SALES_TAX_PERCENTAGE)/100;
      this.TOTAL_PAYMENT += this.SALES_TAX; 
    }

    this.TOTAL_PAYMENT = this.TOTAL_PAYMENT.toFixed(2)

    console.log('cartt to add----' , this.CART_LIST);
    await this.changeDetection.detectChanges();

  }

  async _changeTab (tab_id: any) {

    for(let tab of this.TAB_LIST) tab.is_active = tab.id == tab_id ? true : false;

    let get_current_active_tab = await this.TAB_LIST.filter( data => data.id == tab_id);
    this.CURRENT_TAB = get_current_active_tab.length > 0 ? get_current_active_tab[0]['value'] : 'Products';
    await this.changeDetection.detectChanges();
  }

  async _addVoucher (form_data: any) {

    let data = {
      itemType: 'voucher',
      clientFirstName: form_data.value.firstName,
      clientSirName: form_data.value.sirName,
      clientPhone: form_data.value.phone,
      clientEmail: form_data.value.email,
      noDetailsProvided: form_data.value.no_details_provided,
      voucherSerialNumber: form_data.value.voucher_serial_number,
      description: form_data.value.description,
      price: form_data.value.voucher_amount,
      clientSameEmail: form_data.value.client_same_email,
      email_voucher: form_data.value.email_voucher,
      no_of_item: 1 ,
      image: this.VOUCHER_IMAGE
    };

    this.CART_LIST.push(data);
    await this._calculatePrice();
    await this.changeDetection.detectChanges();
  }

  async _confirmPayment (){

    if (this.SUB_TOTAL == 0){
      return
    }
    

    let data = {
      cart_items : this.CART_LIST,
      total: this.TOTAL_PAYMENT,
      sub_total: this.SUB_TOTAL,
      sales_tax_percentage: this.SALES_TAX_PERCENTAGE,
      discount_percentage: this.DISCOUNT_COUPON_PERCENTAGE
    }

    console.log('cart0-----' , this.CART_LIST);
    

    if (!this.IS_CASH_PAYMENT_ACTIVE) {
      await this.pay(this.TOTAL_PAYMENT)
      return;
    } else {
      
      this.MODEL_OPEN = true;
      this.STRIPE_CHARGE_RESPONSE = '';
      this.MODEL_MESSAGE = "Successfully  completed";
    }
    
    await this.changeDetection.detectChanges();
  }

  async _createCharge(data: any) {

    await (await this.staffService._createCharge(data)).subscribe(
      async (response: any) => {

        console.log('success response' , response)

        if (response.id) {
          this.MODEL_MESSAGE = 'Payment successfully  completed';
          this.MODEL_OPEN = true;
          this.STRIPE_CHARGE_RESPONSE = response;
          //this.STRIPE_CHARGE_RESPONSE = response.receiptUrl;
          await this.changeDetection.detectChanges();
        }
      },
      async (error: any) => {

        console.log('error response' , error)
        console.log('error response' , error.error.text)


        this.MODEL_MESSAGE = 'Payment failed';
        this.MODEL_OPEN = true;
        await this.changeDetection.detectChanges();
         
        
      }
    );
  }

  async _closeModel () {
    
    let voucher_list = [];

    for(let value of this.CART_LIST) {

      let count = Number(value.no_of_item);

      for (let i = 0; i < count; i++) {
        if (value.itemType == 'voucher') {
          voucher_list.push({
            initialBalance: Number(value.price),
            remainingBalance: Number(value.price),
            clientEmail: value.clientEmail,
            clientFirstName: value.clientFirstName,
            clientSurname: value.clientSirName,
            emailTo: value.email_voucher,
            description: value.description,
            stripeId: this.STRIPE_CHARGE_RESPONSE.id,
            expire:   '2024-12-12'
          });
        }
      }
      
    }
    
    await this._createVoucher(voucher_list);
    this.MODEL_OPEN = false;
    this.CART_LIST = [];
    this._calculatePrice();
    if (this.STRIPE_CHARGE_RESPONSE.receiptUrl != '') window.open(this.STRIPE_CHARGE_RESPONSE.receiptUrl, '_blank');
    await this.changeDetection.detectChanges();
    
  }

  async _createVoucher (data: any) {

    await (await this.staffService._createVoucher(data)).subscribe(
      (response: any) => {

        console.log('success---'  , response)
      },
      (error: any) => {

        console.log('error---' , error)
      }
    );
  }

  async _updateFormValue() {

    await this.changeDetection.detectChanges();
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  async _noInfoChange() {

    if (this.ADD_VOUCHER_FORM.value.no_details_provided) {

      await this.ADD_VOUCHER_FORM.get('firstName').clearValidators();
      await this.ADD_VOUCHER_FORM.get('sirName').clearValidators();
      await this.ADD_VOUCHER_FORM.get('phone').clearValidators();
      await this.ADD_VOUCHER_FORM.get('email').clearValidators();

      await this.ADD_VOUCHER_FORM.patchValue({
        firstName : '',
        sirName : '',
        phone : '',
        email : '',
      });

    } else {
      
      await this.ADD_VOUCHER_FORM.get('firstName').setValidators([Validators.required]);
      await this.ADD_VOUCHER_FORM.get('sirName').setValidators([Validators.required]);
      await this.ADD_VOUCHER_FORM.get('phone').setValidators([Validators.required]);
      await this.ADD_VOUCHER_FORM.get('email').setValidators([Validators.required , Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]);
    }

    await this.ADD_VOUCHER_FORM.get('firstName').updateValueAndValidity();
    await this.ADD_VOUCHER_FORM.get('sirName').updateValueAndValidity();
    await this.ADD_VOUCHER_FORM.get('phone').updateValueAndValidity();
    await this.ADD_VOUCHER_FORM.get('email').updateValueAndValidity();
    await this.changeDetection.detectChanges();
  }

  async _sameClientEmail () {

    if (this.ADD_VOUCHER_FORM.value.client_same_email) {
      await this.ADD_VOUCHER_FORM.patchValue({
        email_voucher : this.ADD_VOUCHER_FORM.value.email
      });
    }

    await this.changeDetection.detectChanges();
  }

  get firstName() {
    return this.ADD_VOUCHER_FORM.get('firstName');
  }

  get sirName() {
    return this.ADD_VOUCHER_FORM.get('sirName');
  }

  get phone() {
    return this.ADD_VOUCHER_FORM.get('phone');
  }

  get email() {
    return this.ADD_VOUCHER_FORM.get('email');
  }

  get no_details_provided() {
    return this.ADD_VOUCHER_FORM.get('no_details_provided');
  }

  get voucher_serial_number() {
    return this.ADD_VOUCHER_FORM.get('voucher_serial_number');
  }

  get description() {
    return this.ADD_VOUCHER_FORM.get('description');
  }

  get voucher_amount() {
    return this.ADD_VOUCHER_FORM.get('voucher_amount');
  }

  get email_voucher() {
    return this.ADD_VOUCHER_FORM.get('email_voucher');
  }

  get client_same_email() {
    return this.ADD_VOUCHER_FORM.get('client_same_email');
  }

  public errorMesages = {

    firstName: [
      { type: 'required', message: "Client first name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    sirName: [
      { type: 'required', message: "Client sirname is required" },
    ],

    phone: [
      { type: 'required', message: "Phone is required" },
    ],
    number: [
      { type: 'required', message: "Phone number is required" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    ],

    email: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],

    voucher_serial_number: [
      { type: 'required', message: "Voucher serial number is required" },
    ],

    description: [
      { type: 'required', message: "Description is required" },
    ],

    voucher_amount: [
      { type: 'required', message: "Voucher amount is required" },
    ],

    email_voucher: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],
  };
}
