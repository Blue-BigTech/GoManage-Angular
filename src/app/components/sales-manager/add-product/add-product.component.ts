import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigStaffService } from 'app/config/config.staff.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  ADD_PRODUCT_FORM: FormGroup;
  MODEL_OPEN: boolean = false;
  IMAGE : string = '';
  BRAND_LIST: any = [ {id: 1 , name: "Shoes"}, {id: 2 , name: "T-shirt"}, ];

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private changeDetection: ChangeDetectorRef,
    private staffService: ConfigStaffService) {

    this._initiateClientForm();
  }

  ngOnInit(): void {
  }

  async _initiateClientForm() {

    this.ADD_PRODUCT_FORM = this.fb.group({

      productName: ['', Validators.required],
      brand: ['', Validators.required],
      productDescription: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      isAvailable: ['', Validators.required],
      reorderQuantity: ['', Validators.required],
      unitVolume: ['', Validators.required],
      unitMeasurement: ['ml', Validators.required],
      productImage: ['', Validators.required],
      isHotProduct: ['', ],
    });
  }

  async _addProduct(form: any) {


    let data = {
      name: form.value.productName,
      brandId: Number(form.value.brand),
      description: form.value.productDescription,
      quantity: Number(form.value.quantity),
      price: Number(form.value.price),
      isAvailable: form.value.isAvailable == 1 ? true : false,
      reorderQuantity: Number(form.value.reorderQuantity) ,
      inventoryId: 3,
      unitVolume: Number(form.value.unitVolume),
      unitMeasurement: form.value.unitMeasurement,
      hot: form.value.isHotProduct,
      image: this.IMAGE
    };
    

    await (await this.staffService._addProduct(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {

        

        if (error.status == 200) {

          
          this.MODEL_OPEN = true;
          await this.ADD_PRODUCT_FORM.reset();
          await this._initiateClientForm();
          await this.changeDetection.detectChanges();
        } else {
          alert('server error again');
          
        }
      }
    );

    
  }

  async _closeModel () {

    
    this.MODEL_OPEN = false;
    await this.changeDetection.detectChanges();
    setTimeout(() => {
        this.route.navigate(['sales-manager/product'])
    }, 200);
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
    return this.ADD_PRODUCT_FORM.get('productName');
  }

  get brand() {
    return this.ADD_PRODUCT_FORM.get('brand');
  }

  get productDescription() {
    return this.ADD_PRODUCT_FORM.get('productDescription');
  }

  get quantity() {
    return this.ADD_PRODUCT_FORM.get('quantity');
  }

  get price() {
    return this.ADD_PRODUCT_FORM.get('price');
  }

  get isAvailable() {
    return this.ADD_PRODUCT_FORM.get('isAvailable');
  }

  get reorderQuantity() {
    return this.ADD_PRODUCT_FORM.get('reorderQuantity');
  }

  get unitVolume() {
    return this.ADD_PRODUCT_FORM.get('unitVolume');
  }

  get unitMeasurement() {
    return this.ADD_PRODUCT_FORM.get('unitMeasurement');
  }

  get productImage() {
    return this.ADD_PRODUCT_FORM.get('productImage');
  }

  get isHotProduct() {
    return this.ADD_PRODUCT_FORM.get('isHotProduct');
  }
}
