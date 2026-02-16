const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');
const { timeout } = require('../playwright.config');

/**
 * Test data for checkout tests.
 */
const checkoutTestData = {
  guestEmail: 'sergei.losev+guest@scandiweb.com',
  guestFirstname: 'guest test name',
  guestLastname: 'guest test lastname',
  registeredEmail: 'sergei.losev+2@scandiweb.com',
  registeredPassword: 'Option123!',
  registeredFirstname: 'registered test name',
  registeredLastname: 'registered test lastname',
  regionPfr: 'wielkopolskie',
  postcodePfr: '61028',
  cityPfr: 'Poznań',
  streetPfr: 'Termalna 1',
  telephone: '223322445',
  telephoneCom: '+37256055156',
  telephoneEe: '56055156',
  telephoneLv: '22562562',
  telephonePl: '573564371',
};

/**
 * Page object for Checkout page.
 */
class Checkout extends BasePage {
  constructor(page) {
    super(page);
    this.testData = checkoutTestData;
  }

  /**
   * Locator for checkout page title.
   */
  get checkoutPageTitle() {
    return this.page.locator('.Checkout-Title');
  }

  /**
   * Locator for continue as guest button.
   */
  get continueAsGuestButton() {
    return this.page.locator('.PreCheckout-GuestCheckout button');
  }

  // Login form locators
  get userEmail() {
    return this.page.locator('#email');
  }

  get userPassword() {
    return this.page.locator('#password');
  }

  get loginButton() {
    return this.page.locator('.LoginRegistration-Button');
  }

  // Delivery method locators
  get deliveryMethodSelector() {
    return this.page.locator('.CheckoutDeliveryOptions-Select');
  }

  get deliveryMethodButton() {
    return this.page.locator('.CheckoutDeliveryOptions-TypeListOption_isExpanded button');
  }

  get deliveryOptionButton() {
    return this.page.locator('.CheckoutDeliveryOption');
  }

  get deliveryOptionDropdown() {
    return this.page.locator('.CheckoutDeliveryOption-Row2 .CheckoutDeliveryOption-InputContainer');
  }

  get deliveryOptionDropdownOption() {
    return this.page.locator('.CheckoutDeliveryOption-ListElement li');
  }

  get deliveryStepButton() {
    return this.page.locator('.CheckoutShipping-Button');
  }

  // Address form locators
  get guestEmailField() {
    return this.page.locator('#guest_email');
  }

  get firstNameField() {
    return this.page.locator('#firstname');
  }

  get lastNameField() {
    return this.page.locator('#lastname');
  }

  get regionField() {
    return this.page.locator('#region_id');
  }

  get postcodeField() {
    return this.page.locator('#postcode');
  }

  get cityField() {
    return this.page.locator('#city');
  }

  get streetField() {
    return this.page.locator('#street');
  }

  get telephoneField() {
    return this.page.locator('#telephone');
  }

  get telephonePrefix() {
    return this.page.locator('.TelCode');
  }

  get addressStepButton() {
    return this.page.locator('.CheckoutShipping button');
  }

  // Payment method locators
  get paymentMethod() {
    return this.page.locator('.CheckoutPayments-Methods .CheckoutPayment');
  }

  get paymentOption() {
    return this.page.locator('.CheckoutPayments-SelectedPaymentWrapper button');
  }

  get agreePersonalData() {
    return this.page.locator('#personal_data_processing + label');
  }

  get agreeTerms() {
    return this.page.locator('#terms_agree + label');
  }

  get paymentStepButton() {
    return this.page.locator('.CheckoutBilling-Button');
  }

  // Payment sandbox locators
  get paymentSandboxAcceptButton() {
    return this.page.locator('#user_account_pbl_correct');
  }

  get successPage() {
    return this.page.locator('.CheckoutSuccess');
  }

  // DPD Parcel locators
  get dpdPickupRadio() {
    return this.page.locator('#dpd_pickup');
  }

  /**
   * Select pickup point by type.
   * @param {string} type - Pickup point type (e.g., 'dpd_pickup')
   */
  async selectPickupPoint(type) {
    await expect(this.page.locator(`#${type}`)).toBeVisible();
    await this.page.locator(`#${type}`).click();
  }

  // Makecommerce payment locators
  get makecommercePaymentMethod() {
    return this.page.locator('.CheckoutPayment_code_makecommerce');
  }

  get makecommercePaymentChannel() {
    return this.page.locator('.MakecommercePayment-PaymentChannel');
  }

  get paymentGatewayButton() {
    return this.page.locator('.btn-success');
  }

  /**
   * Verify checkout page is opened.
   */
  async wasCheckoutOpened() {
    await expect(this.checkoutPageTitle).toBeVisible();
  }

  /**
   * Click continue as guest button on Checkout Step 1.
   */
  async clickContinueAsGuest() {
    await expect(this.continueAsGuestButton).toBeVisible();
    await this.continueAsGuestButton.click();
  }

  /**
   * Fill login form on Checkout Step 1.
   */
  async fillLoginForm() {
    await this.userEmail.fill(this.testData.registeredEmail);
    await this.userPassword.pressSequentially(this.testData.registeredPassword, { delay: 100 });
    await this.loginButton.click();
  }

  /**
   * Choose second delivery method on Checkout Step 2.
   */
  async chooseSecondDeliveryMethod() {
    await this.deliveryMethodSelector.click();
    await this.deliveryMethodButton.nth(0).click();
  }

  /**
   * Choose second delivery option on Checkout Step 2.
   */
  async chooseSecondDeliveryOption() {
    await this.deliveryOptionButton.nth(1).click();
    await this.deliveryOptionDropdown.click();
    await this.deliveryOptionDropdownOption.nth(0).click();
  }

  /**
   * Click proceed to Step 3 button on Checkout Step 2.
   */
  async clickProceedToStep3() {
    await this.deliveryStepButton.click();
  }

  /**
   * Fill full shipping address form on Checkout Step 3.
   */
  async fillFullShippingAddressForm() {
    if (await this.guestEmailField.isVisible()) {
      await this.guestEmailField.fill(this.testData.guestEmail);
      await this.firstNameField.fill(this.testData.guestFirstname);
      await this.lastNameField.fill(this.testData.guestLastname);
    } else {
      await this.firstNameField.fill(this.testData.registeredFirstname);
      await this.lastNameField.fill(this.testData.registeredLastname);
    }

    await this.regionField.selectOption(this.testData.regionPfr);
    await this.postcodeField.fill(this.testData.postcodePfr);
    await this.cityField.fill(this.testData.cityPfr);
    await this.streetField.fill(this.testData.streetPfr);
    await this.telephoneField.fill(this.testData.telephone);
  }

  /**
   * Click proceed to Step 4 button on Checkout Step 3.
   */
  async clickProceedToStep4() {
    await this.addressStepButton.click();
  }

  /**
   * Choose first payment method on Checkout Step 4.
   */
  async chooseFirstPaymentMethod() {
    await this.paymentMethod.nth(0).click();
  }

  /**
   * Choose first payment option on Checkout Step 4.
   */
  async chooseFirstPaymentOption() {
    await this.paymentOption.nth(0).click();
  }

  /**
   * Accept agreement checkboxes on Checkout Step 4.
   */
  async acceptAgreement() {
    await this.agreePersonalData.check();
    await this.agreeTerms.check();
  }

  /**
   * Click pay button on Checkout Step 4.
   */
  async clickPayButton() {
    await this.paymentStepButton.click();
  }

  /**
   * Accept sandbox payment on payment portal.
   */
  async acceptSandboxPayment() {
    await this.page.waitForURL('https://vsa.przelewy24.pl/en/payment', { waitUntil: 'domcontentloaded' });
    await expect(this.paymentSandboxAcceptButton).toBeVisible();
    await this.paymentSandboxAcceptButton.click();
    await expect(this.successPage).toBeVisible();
  }

  /**
   * Select delivery method by type.
   * @param {string} type - Delivery type: 'store_pickup', 'parcel', or 'carrier'
   */
  async selectDeliveryMethod(type) {
    await this.page.locator(`.CheckoutDeliveryOptions-TypeListOption_type_${type} button`).click();
  }

  /**
   * Get phone number based on project name from testInfo.
   * @param {Object} testInfo - Playwright testInfo object
   * @returns {string} Phone number for the project
   */
  getPhoneNumberByProject(testInfo) {
    if (testInfo.project.name.includes('pl')) {
      return this.testData.telephonePl;
    } else if (testInfo.project.name.includes('lv')) {
      return this.testData.telephoneLv;
    } else if (testInfo.project.name.includes('com')) {
      return this.testData.telephoneCom;
    } else {
      return this.testData.telephoneEe;
    }
  }

  /**
   * Complete the full guest checkout flow with DPD parcel delivery.
   * @param {Object} testInfo - Playwright testInfo object
   */
  async completeGuestCheckoutDpdParcel(testInfo) {
    // Step 1: Select delivery method
    await expect(this.deliveryMethodSelector).toBeVisible();
    await this.deliveryMethodSelector.click();
    await this.selectDeliveryMethod('parcel');

    // Step 2: Select DPD pickup
    await this.selectPickupPoint('dpd_pickup');
    await expect(this.deliveryOptionDropdown).toBeVisible();
    await this.deliveryOptionDropdown.click();
    await this.deliveryOptionDropdownOption.first().click();

    // Step 3: Proceed to address step
    await expect(this.deliveryStepButton).toBeEnabled();
    await this.deliveryStepButton.click();

    // Step 4: Fill guest form
    await this.guestEmailField.fill(this.testData.guestEmail);
    await this.firstNameField.fill(this.testData.guestFirstname);
    await this.lastNameField.fill(this.testData.guestLastname);
    await this.telephoneField.fill(this.getPhoneNumberByProject(testInfo));

    // Step 5: Submit guest form
    await expect(this.page.locator('.CheckoutGuestForm-ActionsWrapper button')).toBeEnabled();
    await this.page.locator('.CheckoutGuestForm-ActionsWrapper button').click();

    // Step 6: Select makecommerce payment
    await expect(this.makecommercePaymentMethod).toBeVisible();
    await this.makecommercePaymentMethod.click();
    await expect(this.makecommercePaymentChannel.first()).toBeVisible();
    await this.makecommercePaymentChannel.first().click();
    await expect(this.page.locator('label').first()).toBeVisible();
    await this.page.locator('label').first().click();
    await this.page.locator('label').nth(2).click();

    // Step 7: Proceed to payment
    await expect(this.paymentStepButton).toBeEnabled({ timeout: 30000 });
    await this.paymentStepButton.click();
    
    // Wait for navigation to payment gateway URL - use domcontentloaded instead of networkidle
    await this.page.waitForURL('**/banklinktest.maksekeskus.ee/**', { 
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    // Step 8: Handle payment gateway - use web-first assertions
    await expect(this.paymentGatewayButton).toBeEnabled({ timeout: 30000 });
    await this.paymentGatewayButton.click();
    // Wait for button to be enabled again after click
    await expect(this.paymentGatewayButton).toBeEnabled({ timeout: 30000 });
    await this.paymentGatewayButton.click();

    // Step 9: Wait for URL to contain base URL and verify success - use domcontentloaded
    await this.page.waitForURL('**/checkout/**', { waitUntil: 'domcontentloaded' });
    await expect(this.successPage).toBeVisible();
  }
}

module.exports = { Checkout, checkoutTestData };
