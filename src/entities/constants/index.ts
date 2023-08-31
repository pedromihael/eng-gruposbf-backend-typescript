export const constants = {
  errors: {
    userErrors: {
      MISSING_VALUE_OR_BASE_CURRENCY: 'Invalid request body. Body should contain `value` numerical field. If body contains `baseCurrency` it should be a string.',
      NON_NUMERICAL_VALUE: 'Input value is not a number.',
    },
    serverErrors: {
      EXTERNAL_SERVICE_DOWN: 'External Service is down.',
    }
  }
}