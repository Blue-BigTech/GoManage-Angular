import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigStaffService } from 'app/config/config.staff.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  UPDATE_PRODUCT_FORM: FormGroup;
  IMAGE : string = '';
  MODEL_OPEN: boolean = false;
  PRODUCT_ID: any = '';
  BRAND_LIST: any = [ {id: 1 , name: "Shoes"}, {id: 2 , name: "T-shirt"}, ];
  PRIVIOUS_IMAGE: string = "";
  constructor(
    private changeDetection: ChangeDetectorRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private route: Router,
    private staffService: ConfigStaffService) {

    this.PRODUCT_ID = this.activateRoute.snapshot.paramMap.get('id');
    

    this._initiateProductForm();
    this._getProducts();
  }

  ngOnInit(): void {
  }

  async _initiateProductForm() {

    this.UPDATE_PRODUCT_FORM = this.fb.group({
      id:1,
      productName: ['', Validators.required],
      brand: ['', Validators.required],
      productDescription: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      isAvailable: ['', Validators.required],
      reorderQuantity: ['', Validators.required],
      unitVolume: ['', Validators.required],
      unitMeasurement: ['', Validators.required],
      productImage: ['',],
      isHotProduct: [true, ],
    });

    
  }

  async _getProducts () {

    await (await this.staffService._getProducts()).subscribe(
      async (response: any ) => {
        
        
        let find_product = await response.filter( data => data.id == this.PRODUCT_ID);

        if (find_product.length > 0) {

          console.log('my products---' , find_product);
          this.PRIVIOUS_IMAGE = find_product[0].image;

          this.UPDATE_PRODUCT_FORM.patchValue({
            id: this.PRODUCT_ID,
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

          
          this.MODEL_OPEN = true;
          await this.UPDATE_PRODUCT_FORM.reset();
          await this._initiateProductForm();
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

  async _closeModel () {

    
    this.MODEL_OPEN = false;
    await this.changeDetection.detectChanges();
    setTimeout(() => {
        this.route.navigate(['sales-manager/product'])
    }, 200);
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

}
