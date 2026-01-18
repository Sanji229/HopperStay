(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  // Real-time price validation
  const priceInput = document.getElementById('price')
  if (priceInput) {
    priceInput.addEventListener('input', () => {
      const value = priceInput.value
      const numValue = parseFloat(value)
      
      if (value === '' || isNaN(numValue) || numValue < 1 || !Number.isInteger(numValue) && value.includes('.')) {
        priceInput.classList.add('is-invalid')
        priceInput.classList.remove('is-valid')
      } else if (numValue >= 1) {
        priceInput.classList.remove('is-invalid')
        priceInput.classList.add('is-valid')
      }
    })
  }

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
