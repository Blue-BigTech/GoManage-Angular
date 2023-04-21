import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  MAIN_CONTENT: boolean = true;
  PRODUCT_NAME: string = '';
  PRODUCT_ID: any = '';
  BRAND: any = 0;
  MIN_PRICE: any = '';
  MAX_PRICE: any = '';
  QUANTITY: any = '';
  INVENTORY_ID: any = 0;
  SPINNER_TEXT: string = "Loading..."
  MODEL_OPEN: boolean = false;
  MODEL_ADD_PRODUCT_OPEN: boolean = false;
  MODEL_UPDATE_OPEN: boolean = false;
  NEW_BRAND_NAME: string = '';
  NEW_BRAND_STATUS: string = '1';

  PRODUCT_RESPONSE: any = [];
  PRODUCT_LIST: any = [];
  ADD_PRODUCT_FORM: FormGroup;
  UPDATE_PRODUCT_FORM: FormGroup;
  IMAGE : string = '';
  _IMAGE: string = "";
  PRIVIOUS_IMAGE: string = "";
  BRAND_LIST: any = [ 
    {id: 0 , name: "All", color_name: "#00FF00", "select": true} ,
    {id: 1 , name: "Shoes", color_name: "#008000", "select": false}, 
    {id: 2 , name: "T-shirt", color_name: "#00FFFF", "select": false},
  ];
  INVONTRY_LIST: any = [ 
    {id: 1, name: 'In Stock' , color: 'text-info'} , 
    {id: 2, name: 'Out of Stock', color: 'text-danger'} , 
    {id: 3, name: 'Limited', color: 'text-warning'}
  ];

  constructor(
    private fb: FormBuilder,
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private staffService: ConfigStaffService) {

      this._getProducts();
      this._initiateClientForm();
      this._initiateProductAddForm();
     }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.MAIN_CONTENT = false;
    this.changeDetection.detectChanges();
   

   // this.dtTrigger.unsubscribe();
  }
  async _initiateClientForm() {

    this.UPDATE_PRODUCT_FORM = this.fb.group({

      productName: ['', Validators.required],
      brand: ['', Validators.required],
      productDescription: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      isAvailable: ['', Validators.required],
      reorderQuantity: ['', Validators.required],
      unitVolume: ['', Validators.required],
      unitMeasurement: ['ml', Validators.required],
      productImage: ['',],
      isHotProduct: ['', ],
    });
  }
  async _initiateProductAddForm() {

    this.ADD_PRODUCT_FORM = this.fb.group({

      _productName: ['', Validators.required],
      _brand: ['', Validators.required],
      _productDescription: ['', Validators.required],
      _quantity: ['', Validators.required],
      _price: ['', Validators.required],
      _isAvailable: ['', Validators.required],
      _reorderQuantity: ['', Validators.required],
      _unitVolume: ['', Validators.required],
      _unitMeasurement: ['ml', Validators.required],
      _productImage: ['', Validators.required],
      _isHotProduct: ['', ],
    });
  }
  async _addProduct(form: any) {


    let data = {
      name: form.value._productName,
      brandId: Number(form.value._brand),
      description: form.value._productDescription,
      quantity: Number(form.value._quantity),
      price: Number(form.value._price),
      isAvailable: form.value._isAvailable == 1 ? true : false,
      reorderQuantity: Number(form.value._reorderQuantity) ,
      inventoryId: 3,
      unitVolume: Number(form.value._unitVolume),
      unitMeasurement: form.value._unitMeasurement,
      hot: form.value._isHotProduct,
      image: this._IMAGE
    };
    

    await (await this.staffService._addProduct(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {

        if (error.status == 200) {
          await this.ADD_PRODUCT_FORM.reset();
          await this._initiateProductAddForm();
          this._cancelModelProduct();
          await this.changeDetection.detectChanges();
        } else {
          alert('server error again');
          
        }
      }
    );

    
  }
  async _updateProduct(form: any) {


    let data = [{
      id: this.PRODUCT_ID,
      name: form.value.productName,
      brandId: form.value.brand,
      description: form.value.productDescription,
      quantity: form.value.quantity,
      price: form.value.price,
      isAvailable: form.value.isAvailable == 1 ? true : false,
      reorderQuantity: form.value.reorderQuantity ,
      inventoryId: "3",
      unitVolume: form.value.unitVolume,
      unitMeasurement: form.value.unitMeasurement,
      hot: form.value.isHotProduct,
      //image: this.IMAGE
      image: this.IMAGE != '' ? this.IMAGE : this.PRIVIOUS_IMAGE
    }];

    // if (this.IMAGE != '') { 

    //   data[0]['image'] = this.IMAGE;
    // }


    await (await this.staffService._updateProduct(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {

        

        if (error.status == 200) {

          
          this.MODEL_UPDATE_OPEN = true;
          await this.UPDATE_PRODUCT_FORM.reset();
          await this._initiateClientForm();
          this.changeDetection.detectChanges();
          
        } else {
          alert('server error again');
        }
      }
    );


    //this.MODEL_OPEN = true;
  }
  async _selectFile (event:any) {


    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();
  
                reader.onload = (event:any) => {

                  const image = new Image();
                  image.src = event.target.result;

                  image.onload = rs => {
                    
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];
                  };

                 this.IMAGE =  event.target.result;
                  
                }

                reader.readAsDataURL(event.target.files[0]);

    } else {
      this.IMAGE = '';
      //await this.addStaffForm.patchValue({ employeeImg : ''})
    }
  }
  async _product_selectFile (event:any) {


    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();
  
                reader.onload = (event:any) => {

                  const image = new Image();
                  image.src = event.target.result;

                  image.onload = rs => {
                    
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];
                  };

                 this._IMAGE =  event.target.result;
                  
                }

                reader.readAsDataURL(event.target.files[0]);

    } else {
      this._IMAGE = '';
      //await this.addStaffForm.patchValue({ employeeImg : ''})
    }
  }
  async _closeModel () {
    this.MODEL_UPDATE_OPEN = false;
    this._getProducts();
    await this.changeDetection.detectChanges();
   }
   async _cancelModelProduct () {
    this.MODEL_ADD_PRODUCT_OPEN = false;
    this._getProducts();
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


  public errorMesages = {

    productName: [
      { type: 'required', message: "Product name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    brand: [
      { type: 'required', message: "Brand is required" },
    ],
    productDescription: [
      { type: 'required', message: "Product description is required" },
    ],
    quantity: [
      { type: 'required', message: "Quantity is required" },
    ],
    price: [
      { type: 'required', message: "Price is required" },
    ],
    isAvailable: [
      { type: 'required', message: "Availability value is required" },
    ],
    reorderQuantity: [
      { type: 'required', message: "Reorder notification quantity is required" },
    ],
    unitVolume: [
      { type: 'required', message: "Unit volume is required" }
    ],
    unitMeasurement: [
      { type: 'required', message: "Unit measurement is required" },
    ],
    productImage: [
      { type: 'required', message: "Product image is required" },
    ],
    isHotProduct: [
      { type: 'required', message: "Hot product required is required" },
    ],
  }

  get productName() {
    return this.UPDATE_PRODUCT_FORM.get('productName');
  }

  get brand() {
    return this.UPDATE_PRODUCT_FORM.get('brand');
  }

  get productDescription() {
    return this.UPDATE_PRODUCT_FORM.get('productDescription');
  }

  get quantity() {
    return this.UPDATE_PRODUCT_FORM.get('quantity');
  }

  get price() {
    return this.UPDATE_PRODUCT_FORM.get('price');
  }

  get isAvailable() {
    return this.UPDATE_PRODUCT_FORM.get('isAvailable');
  }

  get reorderQuantity() {
    return this.UPDATE_PRODUCT_FORM.get('reorderQuantity');
  }

  get unitVolume() {
    return this.UPDATE_PRODUCT_FORM.get('unitVolume');
  }

  get unitMeasurement() {
    return this.UPDATE_PRODUCT_FORM.get('unitMeasurement');
  }

  get productImage() {
    return this.UPDATE_PRODUCT_FORM.get('productImage');
  }

  get isHotProduct() {
    return this.UPDATE_PRODUCT_FORM.get('isHotProduct');
  }

  get _productName() {
    return this.ADD_PRODUCT_FORM.get('_productName');
  }

  get _brand() {
    return this.ADD_PRODUCT_FORM.get('_brand');
  }

  get _productDescription() {
    return this.ADD_PRODUCT_FORM.get('_productDescription');
  }

  get _quantity() {
    return this.ADD_PRODUCT_FORM.get('_quantity');
  }

  get _price() {
    return this.ADD_PRODUCT_FORM.get('_price');
  }

  get _isAvailable() {
    return this.ADD_PRODUCT_FORM.get('_isAvailable');
  }

  get _reorderQuantity() {
    return this.ADD_PRODUCT_FORM.get('_reorderQuantity');
  }

  get _unitVolume() {
    return this.ADD_PRODUCT_FORM.get('_unitVolume');
  }

  get _unitMeasurement() {
    return this.ADD_PRODUCT_FORM.get('_unitMeasurement');
  }

  get _productImage() {
    return this.ADD_PRODUCT_FORM.get('_productImage');
  }

  async _getProducts () {

    await this.spinner.show();
    await (await this.staffService._getProducts()).subscribe(
      async (response: any ) => {
        
        this.PRODUCT_RESPONSE = response;
        this.PRODUCT_LIST = response;
        this.changeDetection.detectChanges();
        await this.spinner.hide();
      },
      async (error: any) => {
        
        await this.spinner.hide();
      }
    );
  }
  
  async _openBrandPopup () {

    this.MODEL_OPEN = true;
    await this.changeDetection.detectChanges();
  }
  async _openProductPopup () {

    this.MODEL_ADD_PRODUCT_OPEN = true;
    await this.changeDetection.detectChanges();
  }

  async _closeBrandPopup () {

    this.MODEL_OPEN = false;
    await this.changeDetection.detectChanges();
  }

  async _createBrand () {

    if (this.NEW_BRAND_NAME == '') {

      alert('Name cat\' be empty');
      return;
    }

    console.log('brand name--' , this.NEW_BRAND_NAME , this.NEW_BRAND_STATUS);
    this.NEW_BRAND_NAME = '';
    this.NEW_BRAND_STATUS = '1';

    
    await this.changeDetection.detectChanges();
  }
  _selectBrand (brand_id: any) {
    for (let brand of  this.BRAND_LIST){
      if (brand.id == brand_id){
        brand.select = true;
      } else {
        brand.select = false;
      }
    }
    let filter_keys = {};
    if (brand_id != '0') {
      filter_keys['brand_id']  = brand_id;
    }
    if (Object.keys(filter_keys).length === 0) {
    
      this.PRODUCT_LIST = this.PRODUCT_RESPONSE;
      return
    }

    let filter_data = [];
    let all_data =  Object.assign([], this.PRODUCT_RESPONSE);

    for (let product of all_data) {

      let is_product_passed_filter = true;
      
      for (let key in filter_keys) {

        if (key == 'brand_id') {
          if (product.brandId != brand_id) {
            is_product_passed_filter = false;
          }
        }
      }

      if (is_product_passed_filter) {
        filter_data.push(product)
      }
    }
    this.PRODUCT_LIST = filter_data;  
    this.changeDetection.detectChanges();     
  }
  async _applyFilter () {
    let product_name = this.PRODUCT_NAME;
    let brand_id = this.BRAND;
    let min_price = this.MIN_PRICE;
    let max_price = this.MAX_PRICE;
    let quantity = this.QUANTITY;
    let inventory_id = this.INVENTORY_ID;

    let filter_keys = {};

    if (product_name != '') {
    
      filter_keys['product_name']  = product_name;
    }

    if (brand_id != '0') {
    
      filter_keys['brand_id']  = brand_id;
    }

    if (min_price != '' || max_price != '' ) {
    
      filter_keys['price']  = { min:  min_price , max: max_price};
    }

    if (quantity != '') {
    
      filter_keys['quantity']  = quantity;
    }

    if (inventory_id != '0') {
    
      filter_keys['inventory_id']  = inventory_id;
    }

    // If didn't select any filter
    if (Object.keys(filter_keys).length === 0) {
    
      this.PRODUCT_LIST = this.PRODUCT_RESPONSE;
      return
    }

    let filter_data = [];
    let all_data =  Object.assign([], this.PRODUCT_RESPONSE);

    for (let product of all_data) {

      let is_product_passed_filter = true;
      
      for (let key in filter_keys) {

        if (key == 'product_name') {

          let name = product.name.toLocaleLowerCase();
          let search_product_name = product_name.toLocaleLowerCase();
          if (name.indexOf(search_product_name.toLocaleLowerCase()) == -1){

            is_product_passed_filter = false;
          }
        }

        if (key == 'brand_id') {

          if (product.brandId != brand_id) {

            is_product_passed_filter = false;
          }
        }

        if (key == 'price') {

          
          if (filter_keys[key]['min']  != '' && filter_keys[key]['max']  != '') {

            
            if (Number(filter_keys[key]['min'])-1 < product.price && Number(filter_keys[key]['max'])+1 > product.price) {
              
            } else {
              is_product_passed_filter = false;
            }
          } else {

            if (filter_keys[key]['min'] > product.price && filter_keys[key]['min']  != '') {

              is_product_passed_filter = false;
            }

            if (filter_keys[key]['max'] < product.price && filter_keys[key]['max']  != '') {

              is_product_passed_filter = false;
            }
          }
         
          // if (product.quantity != quantity) {

          //   is_product_passed_filter = false;
          // }
        }

        if (key == 'quantity') {

          if (product.quantity != quantity) {

            is_product_passed_filter = false;
          }
        }

        if (key == 'inventory_id' && inventory_id != '0') {

          if (product.inventoryId != inventory_id) {

            is_product_passed_filter = false;
          }
        }

       
      }

      if (is_product_passed_filter) {
        filter_data.push(product)
      }

     
    }
    this.PRODUCT_LIST = filter_data;        

  }

  async _clearFilter () {

    this.PRODUCT_NAME = '';
    this.BRAND = 0;
    this.MIN_PRICE = '';
    this.MAX_PRICE = '';
    this.QUANTITY = '';
    this.INVENTORY_ID = 0;

    this.PRODUCT_LIST = this.PRODUCT_RESPONSE;
  }

  async _deleteProduct(product_id: any) {

    if (confirm("Are you sure ? you want to delete this product.")) {
      
      this.PRODUCT_LIST = await this.PRODUCT_LIST.filter( data => data.id != product_id);
      this.changeDetection.detectChanges();

      await (await this.staffService._deleteProducts(product_id)).subscribe(
        (response: any) => {

        },
        (error: any) => {

        }
      );
    }
  }
  async _getSelectedProduct (product_id: any) {
    this.PRODUCT_ID = product_id;
    await (await this.staffService._getProducts()).subscribe(
      async (response: any ) => {
        
        
        let find_product = await response.filter( data => data.id == product_id);

        if (find_product.length > 0) {

          console.log('my products---' , find_product);
          this.PRIVIOUS_IMAGE = find_product[0].image;

          this.UPDATE_PRODUCT_FORM.patchValue({
            productName: find_product[0].name,
            brand: find_product[0].brandId,
            productDescription: find_product[0].description,
            quantity: find_product[0].quantity,
            price: find_product[0].price,
            isAvailable: find_product[0].isAvailable == true ? 1 : 2,
            reorderQuantity: find_product[0].reorderQuantity,
            unitVolume: find_product[0].unitVolume,
            unitMeasurement: find_product[0].unitMeasurement,
            isHotProduct: find_product[0].hot,

          });
        }
        this.changeDetection.detectChanges();
      },
      (error: any) => {
      }
    );
  }

}
