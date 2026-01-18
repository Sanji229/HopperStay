(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  // Real-time price validation
  const priceInput = document.getElementById('price')
  if (priceInput) {
    // Block invalid keys (minus, plus, e, decimal, letters)
    priceInput.addEventListener('keydown', (e) => {
      const invalidKeys = ['-', '+', 'e', 'E', '.']
      if (invalidKeys.includes(e.key)) {
        e.preventDefault()
        // Show error message
        priceInput.classList.add('is-invalid')
      }
    })

    // Block paste of invalid content
    priceInput.addEventListener('paste', (e) => {
      const pasteData = e.clipboardData.getData('text')
      if (!/^\d+$/.test(pasteData)) {
        e.preventDefault()
        priceInput.classList.add('is-invalid')
      }
    })

    // Validate on input
    priceInput.addEventListener('input', () => {
      const value = priceInput.value
      const numValue = parseInt(value)
      
      if (value === '' || isNaN(numValue) || numValue < 1) {
        priceInput.classList.add('is-invalid')
        priceInput.classList.remove('is-valid')
      } else {
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
