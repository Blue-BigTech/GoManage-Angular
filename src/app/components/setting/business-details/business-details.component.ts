import { Component, OnInit ,ViewChild,ElementRef, ChangeDetectorRef} from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css']
})
export class BusinessDetailsComponent implements OnInit {

  SPINNER_TEXT: string = "Wait..."
  NEW_CATEGORY_MODEL_OPEN: boolean = false;
  EDIT_CATEGORY_MODEL_OPEN: boolean = false;
  NEW_SERVICE_MODEL_OPEN: boolean = false;
  NEW_CATEGORY_NAME: string = '';
  EDIT_CATEGORY_NAME: string = '';

  NEW_SERVICE_NAME: string = '';
  NEW_SERVICE_DURATION: string = '00:00';
  NEW_SERVICE_DESCRIPTION: string = '';
  NEW_SERVICE_PRICE: string = '';

  SELECTED_COLOR: any = {};
  EDIT_CATEGORY_SELECTED_COLOR: any = {};
  SUCCESS_POP_UP: boolean = false;
  SUCCESS_POP_UP_MESSAGE: string ="New Category successfully added!";

  UPDATE_SERVICE_FORM: FormGroup ;
  UPDATE_SETTING_FORM: FormGroup ;
  CATEGORIES: any = [];

  SERVICES_LIST: any = [];

  SELECTED_SERVICES_LIST: any = [];
  SELECTED_CATEGORY: any = {};
  

  COLOR_LIST: any = [];
  public show_sun:boolean = false;
  public txt_sun:any = 'Closed';
  public show_mon:boolean = false;
  public txt_mon:any = 'Closed';
  public show_tue:boolean = false;
  public txt_tue:any = 'Closed';
  public show_wed:boolean = false;
  public txt_wed:any = 'Closed';
  public show_thr:boolean = false;
  public txt_thr:any = 'Closed';
  public show_fri:boolean = false;
  public txt_fri:any = 'Closed';
  public show_sat:boolean = false;
  public txt_sat:any = 'Closed';
  constructor(
    private changeDetection: ChangeDetectorRef,
    private staffService: ConfigStaffService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    ) {


    //this._allCategories();
    this._updateServiceFormInit();
    this._updateSettingFormInit();
    this._getColourList()
  }
  
  

  ngOnInit(): void {
  }
  checkValue_sun(){
    this.show_sun = !this.show_sun;
    if(this.show_sun)  
      this.txt_sun = "Open";
    else
      this.txt_sun = "Closed";
  }
  checkValue_mon(){
    this.show_mon = !this.show_mon;
    if(this.show_mon)  
      this.txt_mon = "Open";
    else
      this.txt_mon = "Closed";
  }
  checkValue_tue(){
    this.show_tue = !this.show_tue;
    if(this.show_tue)  
      this.txt_tue = "Open";
    else
      this.txt_tue = "Closed";
  }
  checkValue_wed(){
    this.show_wed = !this.show_wed;
    if(this.show_wed)  
      this.txt_wed = "Open";
    else
      this.txt_wed = "Closed";
  }
  checkValue_thr(){
    this.show_thr = !this.show_thr;
    if(this.show_thr)  
      this.txt_thr = "Open";
    else
      this.txt_thr = "Closed";
  }
  checkValue_fri(){
    this.show_fri = !this.show_fri;
    if(this.show_fri)  
      this.txt_fri = "Open";
    else
      this.txt_fri = "Closed";
  }
  checkValue_sat(){
    this.show_sat = !this.show_sat;
    if(this.show_sat)  
      this.txt_sat = "Open";
    else
      this.txt_sat = "Closed";
  }
  _updateSettingFormInit () {
    this.UPDATE_SETTING_FORM = this.fb.group({
      businessName: ['', Validators.required],
      businessAddress: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }
  async _updateSetting () {
    this.SUCCESS_POP_UP_MESSAGE = "Business detail settings updated successfully!";
    this.SUCCESS_POP_UP = true;
    this.UPDATE_SETTING_FORM.reset();
    this._updateSettingFormInit();
    this.changeDetection.detectChanges();
  }
  async _updateServiceFormInit () {

    this.UPDATE_SERVICE_FORM = this.fb.group({

      id: ['', Validators.required],
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      servicePrice: ['', Validators.required],
      serviceDuration: ['', Validators.required],
      categoryId: ['', Validators.required],
      colourId: ['', Validators.required],
      active: [true, Validators.required],
       
    });
  }

  async _getColourList() {

    await this.spinner.show();

    await (await this.staffService._getColourList()).subscribe(
      async (response: any) => {

        this.COLOR_LIST = response;

        await this._getServiceList();
      },
      async (error: any) => {
        await this.spinner.hide();
        alert('server error occuered')
        //await this._getServiceList();
      }
    );
  }

  async _updateFormValue() {

    await this.changeDetection.detectChanges();
  }

  async _getServiceList() {

    await (await this.staffService._getServiceList()).subscribe(
      async (response: any) => {

        this.SERVICES_LIST = response
        this._getCategoryList()
      },
      async (error: any) => {

        await this.spinner.hide();
        //this._getCategoryList()
      }
    );
  }

  async _getCategoryList() {

    await (await this.staffService._getCategoryList()).subscribe(
      async (response: any) => {


        if (response.length > 0) {

          for (let index in response) {

            response[index]['selected'] = index == '0' ? true : false;
          }

          this.CATEGORIES = response;
          await this.spinner.hide();

          await this._allCategories();
        }
        

      },
      async (error: any) => {

        await this.spinner.hide();
      }
    );
  }

  async _allCategories () {
    

    for (let category of this.CATEGORIES) {

      let get_colour_data = await this.COLOR_LIST.filter(data => data.id == category.colourId);

      if (get_colour_data.length > 0) {

        category.color_text = get_colour_data[0].colourText;
        category.color_name = get_colour_data[0].colourCode;
      }
    }

    if (this.CATEGORIES.length == 0) return; // Nothing happend when category is Empty

    let selected_category_id =  this.SELECTED_CATEGORY.id !== undefined ? this.SELECTED_CATEGORY.id :  this.CATEGORIES[0].id;

    if (this.SELECTED_CATEGORY.id == undefined) {

    } else {
    }
    
    this._selectCategory(selected_category_id);
  }

  async _selectCategory (category_id: any) {

    for (let category of  this.CATEGORIES){

      if (category.selected = category.id == category_id){

        category.select = category.id == category_id ?  true : false;
        this.SELECTED_CATEGORY = category;
      } else {

        category.select = false;
      }
      
    }

    this.SELECTED_SERVICES_LIST = await this.SERVICES_LIST.filter( data => data.categoryId == category_id);
    
    this.changeDetection.detectChanges();
  }

  async _selectColour (colour_data: any) {

    this.SELECTED_COLOR = colour_data;
    this.changeDetection.detectChanges();
    
    //let get_colour = await this.COLOR_LIST.filter( data => data.id == )
  }

  async _selectColourEditCatgory (colour_data: any) {

    this.EDIT_CATEGORY_SELECTED_COLOR = colour_data;
    this.changeDetection.detectChanges();
    
    //let get_colour = await this.COLOR_LIST.filter( data => data.id == )
  }

  _openNewCategoryPopup () {

    this.NEW_CATEGORY_MODEL_OPEN = true;
  }

  _closeNewCategoryPopup () {

    this.NEW_CATEGORY_MODEL_OPEN = false;
    this.SELECTED_COLOR = {};
    this.NEW_CATEGORY_NAME = '';
    
  }

  _openNewServicePopup () {

    this.NEW_SERVICE_MODEL_OPEN = true;
  }

  _closeNewServicePopup () {

    this.NEW_SERVICE_MODEL_OPEN = false;
    this.NEW_SERVICE_NAME = '';
    this.NEW_SERVICE_DURATION = '';
    this.NEW_SERVICE_DESCRIPTION = '';
    this.NEW_SERVICE_PRICE = '';
  }

  async _createNewService () {


    if (this.NEW_SERVICE_NAME == '') {

      alert("Service name can't be empmty");
      return;
    }

    if (this.NEW_SERVICE_DURATION == '' || this.NEW_SERVICE_DURATION == '00:00') {

      alert("Service duration can't be empmty");
      return;
    }

    if (this.NEW_SERVICE_DESCRIPTION == '') {

      alert("Service description can't be empmty");
      return;
    }

    if (this.NEW_SERVICE_PRICE == '') {

      alert("Service price can't be empmty");
      return;
    }

    let add_service_data =  {
                              serviceName: this.NEW_SERVICE_NAME,
                              serviceDescription: this.NEW_SERVICE_DESCRIPTION,
                              servicePrice: this.NEW_SERVICE_PRICE,
                              serviceDuration:  this.NEW_SERVICE_DURATION,
                              categoryId: this.SELECTED_CATEGORY.id,
                              colourId: this.SELECTED_CATEGORY.colourId,
                              active: true
                            };
                            
    
    await this._addService(add_service_data);

    // return;

    // this.SERVICES_LIST.push({
    //                           id: this.SERVICES_LIST.length, 
    //                           serviceName: this.NEW_SERVICE_NAME , 
    //                           servicePrice : this.NEW_SERVICE_PRICE , 
    //                           serviceDescription : this.NEW_SERVICE_DESCRIPTION , 
    //                           serviceDuration : this.NEW_SERVICE_DURATION , 
    //                           categoryName : this.SELECTED_CATEGORY.categoryName , 
    //                           colourId : this.SELECTED_CATEGORY.colourId , 
    //                           categoryId : this.SELECTED_CATEGORY.id,
    //                         });

    // this._selectCategory(this.SELECTED_CATEGORY.id)
    // this._closeNewServicePopup();
    // this.SUCCESS_POP_UP_MESSAGE =" New Service successfully added!";
    // this.SUCCESS_POP_UP = true;
    // this.changeDetection.detectChanges();
  } 

  async _addService (data: any) {

    await (await this.staffService._addService(data)).subscribe(
      (response: any) => {
        
      },
      (error: any) => {


        if(error.status == 200) {

          this._closeNewServicePopup();
          this.SUCCESS_POP_UP_MESSAGE =" New Service successfully added!";
          this.SUCCESS_POP_UP = true;
          this.changeDetection.detectChanges();
          
        }
      }
    );
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  async _createNewCategory () {
    
    if (this.NEW_CATEGORY_NAME == '' || this.NEW_CATEGORY_NAME == undefined) {
      alert("Category name can't be empty");
      return
    }

    if (this.SELECTED_COLOR.hasOwnProperty('id') == false || this.SELECTED_COLOR == undefined) {

      alert("Please select Category colour");
      return
    }

    let check_colour_exist = this.CATEGORIES.filter( data => data.color_name == this.SELECTED_COLOR.colourCode);

    if (check_colour_exist.length > 0) {

      alert("Selected colour already taken by another category. Please select other colour");
      return  
    }


    // this.CATEGORIES.push({
    //     id: this.CATEGORIES.length+1 , 
    //     categoryName: this.NEW_CATEGORY_NAME , 
    //     color_name : this.SELECTED_COLOR.colourCode , 
    //     color_text: this.SELECTED_COLOR.colourText,
    //     selected : false,
    //     colourId: this.SELECTED_COLOR.id,
        
    // });
    
    

    let new_category_data = {
      categoryName: this.NEW_CATEGORY_NAME,
      colourId: this.SELECTED_COLOR.id,
      active: true

    }

    await this._addCategory(new_category_data)
    
  }

  async _addCategory(data: any) {


    await (await this.staffService._addServiceCategory(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {


        if (error.status == 200) {

          this._closeNewCategoryPopup();
          this.SUCCESS_POP_UP_MESSAGE = "New Category successfully added!";
          this.SUCCESS_POP_UP = true;
          
          this.changeDetection.detectChanges();
        }
      }
    );
  }

  async _editCategory (category_value: any) {


    this.EDIT_CATEGORY_NAME = category_value.categoryName;

    let find_colour = await this.COLOR_LIST.filter(data => data.id == category_value.colourId);
    
    this.EDIT_CATEGORY_SELECTED_COLOR = find_colour.length > 0 ?  find_colour[0] : {};
    
    this.EDIT_CATEGORY_MODEL_OPEN = true;
    this.changeDetection.detectChanges();
  }

  async _updateCategory () {

    if (this.EDIT_CATEGORY_NAME == '' || this.EDIT_CATEGORY_NAME == undefined) {
      alert("Category name can't be empty");
      return
    }

    if (this.EDIT_CATEGORY_SELECTED_COLOR.hasOwnProperty('id') == false || this.EDIT_CATEGORY_SELECTED_COLOR == undefined) {

      alert("Please select Category colour");
      return
    }

    let check_colour_exist = this.CATEGORIES.filter( data => data.id != this.SELECTED_CATEGORY.id &&  data.color_name == this.EDIT_CATEGORY_SELECTED_COLOR.colourCode);

    if (check_colour_exist.length > 0) {

      alert("Selected colour already taken by another category. Please select other colour");
      return  
    }

    let data = [{
      id: this.SELECTED_CATEGORY.id,
      categoryName : this.EDIT_CATEGORY_NAME,
      colourId : this.EDIT_CATEGORY_SELECTED_COLOR.id,
      active : true
    }];

    

    await (await this.staffService._updateServiceCategory(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {


        if (error.status == 200) {

          this._closeEditCategoryPopup();
          this.SUCCESS_POP_UP_MESSAGE = " Category updated successfully!";
          this.SUCCESS_POP_UP = true;
          
          this.changeDetection.detectChanges();
        }
      }
    );
    // this.EDIT_CATEGORY_MODEL_OPEN = false;
    // this.changeDetection.detectChanges();
  }


  async _deleteCategory () {

    if (confirm("Are you sure ? you want to delete this category")) {

      await (await this.staffService._deleteServiceCategory(this.SELECTED_CATEGORY.id)).subscribe(
        async (response: any) => {
  
        },
        async (error: any) => {
  
  
          if (error.status == 200) {
  
            
            this._closeEditCategoryPopup();
            this.SUCCESS_POP_UP_MESSAGE = "Category deleted successfully!";
            this.SUCCESS_POP_UP = true;
            
            this.changeDetection.detectChanges();
          }
        }
      );
    }
  }

  async _closeEditCategoryPopup () {

    this.EDIT_CATEGORY_MODEL_OPEN = false;
    this.changeDetection.detectChanges();
  }

  _closeSuccessModel(){

    this.SUCCESS_POP_UP = false;
    this._getColourList()
  }

  async _getSerceValue (service_info: any) {


    await this.UPDATE_SERVICE_FORM.patchValue({
      id: service_info.id,
      serviceName: service_info.serviceName,
      serviceDescription: service_info.serviceDescription,
      servicePrice: service_info.servicePrice,
      serviceDuration: service_info.serviceDuration,
      categoryId: service_info.categoryId,
      colourId: this.SELECTED_CATEGORY.colourId,
      
    });

    this.changeDetection.detectChanges();
  }

  async _updateService () {


    let update_service_data = [{
                                id: this.UPDATE_SERVICE_FORM.value.id,
                                serviceName: this.UPDATE_SERVICE_FORM.value.serviceName,
                                serviceDescription: this.UPDATE_SERVICE_FORM.value.serviceDescription,
                                servicePrice: Number(this.UPDATE_SERVICE_FORM.value.servicePrice),
                                serviceDuration: this.UPDATE_SERVICE_FORM.value.serviceDuration,
                                categoryId: this.UPDATE_SERVICE_FORM.value.categoryId,
                                colourId: this.UPDATE_SERVICE_FORM.value.colourId,
                                isActive: true
                              }];


    await (await this.staffService._updateService(update_service_data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {


        if (error.status == 200) {

          this.SUCCESS_POP_UP_MESSAGE = "Service updated successfully!";
          this.SUCCESS_POP_UP = true;

          await this.UPDATE_SERVICE_FORM.reset();
          await this._updateServiceFormInit();
          
          this.changeDetection.detectChanges();
        }
      }
    );
  }

  async _deleteService (service_id: any) {

    if (confirm("Are you sure ? you want to delete this service")) {
      
      await (await this.staffService._deleteService(service_id)).subscribe(
        async (response: any) => {
  
        },
        async (error: any) => {
  
  
          if (error.status == 200) {
  
            this.SUCCESS_POP_UP_MESSAGE = "Service deleted successfully!";
            this.SUCCESS_POP_UP = true;
  
            await this.UPDATE_SERVICE_FORM.reset();
            await this._updateServiceFormInit();
            
            this.changeDetection.detectChanges();
          }
        }
      );
    }
  }


  public errorMesages = {

    id: [
      { type: 'required', message: "ID is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    businessName: [
      { type: 'required', message: "Name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    businessAddress: [
      { type: 'required', message: "Address is required" },
    ],
    businessEmail: [
      { type: 'required', message: "Email is required" },
    ],
    businessPhone: [
      { type: 'required', message: "Phone is required" },
    ],
    businessCompany: [
      { type: 'required', message: "Company is required" },
    ],
    BusinessCurrency: [
      { type: 'required', message: "Currency is required" },
    ],
  };

  get id() {
    return this.UPDATE_SERVICE_FORM.get('id');
  }

  get serviceName() {
    return this.UPDATE_SERVICE_FORM.get('serviceName');
  }

  get serviceDescription() {
    return this.UPDATE_SERVICE_FORM.get('serviceDescription');
  }

  get servicePrice() {
    return this.UPDATE_SERVICE_FORM.get('servicePrice');
  }

  get serviceDuration() {
    return this.UPDATE_SERVICE_FORM.get('serviceDuration');
  }

  get categoryId() {
    return this.UPDATE_SERVICE_FORM.get('categoryId');
  }

  get colourId() {
    return this.UPDATE_SERVICE_FORM.get('colourId');
  }



}
