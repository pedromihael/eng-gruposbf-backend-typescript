export const constants = {
  errors: {
    userErrors: {
      MISSING_VALUE_OR_BASE_CURRENCY: 'Invalid request body. Body should contain `value` numerical field. If body contains `baseCurrency` it should be a string.',
      NON_NUMERICAL_VALUE: 'Input value is not a number.',
      MISSING_REQUEST_BODY: 'Missing request body.',
      CODE_NOT_SUPPORTED: 'ISO currency code not supported.',
      WRONG_PARAM_TYPE: 'Wrong param type',
      CURRENCY_NOT_FOUND: 'Currency not found',
      CURRENCY_NOT_UPDATED: 'Currency not updated',
    },
    serverErrors: {
      EXTERNAL_SERVICE_DOWN: 'External Service is down.',
    }
  }
}