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
    return this.page.locator('.CheckoutDeliveryOption .CheckoutDeliveryOption-InputContainer');
  }

  get deliveryOptionDropdownOption() {
    return this.page.locator('.CheckoutDeliveryOption-ListElement li, [role="option"]');
  }

  get storePickupDropdownSelected() {
    return this.page.locator('.StorePickupDropdown-Selected');
  }

  get storePickupDropdownStore() {
    return this.page.locator('.StorePickupDropdown-Store');
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

  get guestFormSubmitButton() {
    return this.page.locator('.CheckoutGuestForm-ActionsWrapper button');
  }

  get agreementLabels() {
    return this.page.locator('label');
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

  // Payment method locators
  getPaymentMethodLocator(paymentCode) {
    return this.page.locator(`.CheckoutPayment_code_${paymentCode}`);
  }

  get makecommercePaymentChannel() {
    return this.page.locator('.MakecommercePayment-PaymentChannel');
  }

  get paymentGatewayButton() {
    return this.page.locator('.btn-success');
  }

  /**
   * Click continue as guest button on Checkout Step 1.
   */
  async clickContinueAsGuest() {
    await expect(this.continueAsGuestButton).toBeVisible();
    await this.continueAsGuestButton.click();
  }

  /**
   * Select delivery method by type.
   * @param {string} type - Delivery type: 'store_pickup', 'parcel', or 'carrier'
   */
  async selectDeliveryMethod(type) {
    await this.page.locator(`.CheckoutDeliveryOptions-TypeListOption_type_${type} button`).click();
  }

  /**
   * Open delivery options and select delivery method.
   * @param {string} type - Delivery type: 'store_pickup', 'parcel', or 'carrier'
   */
  async selectDeliveryType(type) {
    await expect(this.deliveryMethodSelector).toBeVisible();
    await this.deliveryMethodSelector.click();
    await this.selectDeliveryMethod(type);
  }

  /**
   * Select first available delivery option.
   * Handles both dropdown-based and direct-option delivery UIs.
   */
  async selectFirstAvailableDeliveryOption() {
    // Store pickup has its own dropdown implementation.
    if (await this.storePickupDropdownSelected.first().isVisible()) {
      await this.storePickupDropdownSelected.first().click();
      await expect(this.storePickupDropdownStore.first()).toBeVisible();
      await this.storePickupDropdownStore.first().click();
      return;
    }

    if (await this.deliveryOptionDropdown.first().isVisible()) {
      await this.deliveryOptionDropdown.first().click();
      await expect(this.deliveryOptionDropdownOption.first()).toBeVisible();
      await this.deliveryOptionDropdownOption.first().click();
      return;
    }

    await expect(this.deliveryOptionButton.first()).toBeVisible();
    await this.deliveryOptionButton.first().click();

    if (await this.deliveryOptionDropdown.first().isVisible()) {
      await this.deliveryOptionDropdown.first().click();
      await expect(this.deliveryOptionDropdownOption.first()).toBeVisible();
      await this.deliveryOptionDropdownOption.first().click();
    }
  }

  /**
   * Proceed from delivery step to guest details step.
   */
  async continueFromDeliveryStep() {
    await expect(this.deliveryStepButton).toBeEnabled();
    await this.deliveryStepButton.click();
  }

  /**
   * Fill guest contact form.
   * @param {Object} testInfo - Playwright testInfo object
   */
  async fillGuestContactForm(testInfo) {
    await this.guestEmailField.fill(this.testData.guestEmail);
    await this.firstNameField.fill(this.testData.guestFirstname);
    await this.lastNameField.fill(this.testData.guestLastname);
    await this.telephoneField.fill(this.getPhoneNumberByProject(testInfo));
  }

  /**
   * Submit guest form.
   */
  async submitGuestForm() {
    await expect(this.guestFormSubmitButton).toBeEnabled();
    await this.guestFormSubmitButton.click();
  }

  /**
   * Select default MakeCommerce payment method and agreements.
   */
  async selectDefaultPaymentAndAgreements() {
    const paymentMethod = this.getPaymentMethodLocator('makecommerce');
    await expect(paymentMethod).toBeVisible();
    await paymentMethod.click();
    await expect(this.makecommercePaymentChannel.first()).toBeVisible();
    await this.makecommercePaymentChannel.first().click();
    await expect(this.agreementLabels.first()).toBeVisible();
    await this.agreementLabels.first().click();
    await this.agreementLabels.nth(2).click();
  }

  /**
   * Proceed to payment gateway and confirm transaction.
   */
  async completePaymentInGateway() {
    await expect(this.paymentStepButton).toBeEnabled({ timeout: 30000 });
    await this.paymentStepButton.click();

    await this.page.waitForURL('**/banklinktest.maksekeskus.ee/**', {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await expect(this.paymentGatewayButton).toBeEnabled({ timeout: 30000 });
    await this.paymentGatewayButton.click();
    await expect(this.paymentGatewayButton).toBeEnabled({ timeout: 30000 });
    await this.paymentGatewayButton.click();
  }

  /**
   * Wait for checkout success page after payment.
   */
  async assertCheckoutSuccess() {
    await this.page.waitForURL('**/checkout/**', { waitUntil: 'domcontentloaded' });
    await expect(this.successPage).toBeVisible({ timeout: 30000 });
  }

  /**
   * Shared part of guest checkout from delivery step to success.
   * @param {Object} testInfo - Playwright testInfo object
   */
  async completeGuestCheckoutFromDelivery(testInfo) {
    await this.continueFromDeliveryStep();
    await this.fillGuestContactForm(testInfo);
    await this.submitGuestForm();
    await this.selectDefaultPaymentAndAgreements();
    await this.completePaymentInGateway();
    await this.assertCheckoutSuccess();
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
    await this.selectDeliveryType('parcel');

    // Step 2: Select DPD pickup
    await this.selectPickupPoint('dpd_pickup');
    await this.selectFirstAvailableDeliveryOption();
    await this.completeGuestCheckoutFromDelivery(testInfo);
  }

  /**
   * Complete the full guest checkout flow with store pickup delivery.
   * @param {Object} testInfo - Playwright testInfo object
   */
  async completeGuestCheckoutStorePickup(testInfo) {
    // Step 1: Select delivery method
    await this.selectDeliveryType('store_pickup');

    // Step 2: Select first available store pickup option
    await this.selectFirstAvailableDeliveryOption();

    await this.completeGuestCheckoutFromDelivery(testInfo);
  }
}

module.exports = { Checkout, checkoutTestData };
