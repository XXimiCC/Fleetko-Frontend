export const dictionary = {
  en: {
    custom: {
      label: {
        required: 'Please enter the label for your address',
        max: 'Please enter the label less than 19 characters'
      },
      'first-name': {
        required: 'Please enter your first name',
        max: 'Please enter the first name less than 20 characters'
      },
      'last-name': {
        required: 'Please enter your last name',
        max: 'Please enter the last name less than 20 characters'
      },
      'review-heading': {
        max: 'Please enter the title less than 100 characters'
      },
      'review-message': {
        required: 'Please enter the message',
        max: 'Please enter the message less than 2000 characters.'
      },
      email: {
        required: 'Please enter the email',
        email: 'Please enter valid email'
      },
      password: {
        required: 'Please enter the password',
        min: 'Please enter the password more than 6 characters'
      },
      'password-confirm': {
        required: 'Please enter the password',
        min: 'Please enter the password more than 6 characters',
        confirmed: 'Password confirm does not match password'
      },
      address: {
        required: 'Please enter needed street address'
      },
      city: {
        required: 'Please enter the city corresponding to the street address'
      },
      state: {
        required: 'Please select the state corresponding to the city',
        'custom_validation': 'Please select the state corresponding to the city'
      },
      zip: {
        required: ' Please enter the ZIP code corresponding to the street address',
        min: 'The ZIP code must be 5 characters long',
        max: 'The ZIP code must be 5 characters long'
      },
      phone: {
        required: 'Please enter your phone number',
        min: 'The phone number must be 12 characters long'
      },
      'feedback-name': {
        required: 'Please enter your name',
        max: 'Please enter the name less than 19 characters'
      },
      'feedback-message': {
        required: 'Please enter the message'
      },
      'state-abbr': {
        required: 'Please select the state'
      },
      'permit-company': {
        required: 'Please enter company name',
        max: 'Company name be under 80 characters'
      },
      'permit-number': {
        required: 'Please enter permit number',
        max: 'Company name be under 20 characters'
      },
      'effective_date': {
        required: ' Please select the date'
      },
      'expiration_date': {
        required: ' Please select the date'
      }
    }
  }
}
