


// ================HELPER FUNCTIONS===================
const _id = (elem) => {
  return document.getElementById(elem)
}
const _qs = (elem) => {
  return document.querySelector(elem)
}
const _qsAll = (elem) => {
  return document.querySelectorAll(elem)
}

const getSingleInvoice = (id) => {
  let singleInvoice = appState.filter(item => {
    return item.id === id
  })
  localStorage.setItem('single-invoice', JSON.stringify(singleInvoice))
  window.location.assign("invoice.html");
}

const generateID = () => {
  let id = '';
  let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let nums = '0123456789'
  const randomNum = (str) => {
    return Math.floor(Math.random() * str.length)
  }
  const result1 = randomNum(alpha)
  const result2 = randomNum(alpha)
  id += alpha[result1] + alpha[result2]
  let counter = 0;
  while (counter < 4) {
    let num = randomNum(nums)
    id += num
    counter++
  }
  return id
}

const getInvoiceByID = (id) => {
  return appState.filter(item => item.id === id)
}

const createDate = () => {
  const time = new Date();
  let day = time.getDate()
  let month = time.getMonth() + 1
  let year = time.getFullYear()
  if (day < 9) {
    day = `0${day}`
  }
  if (month < 9) {
    month = `0${month}`
  }
  let str = `${year}-${month}-${day}`
  return str;
}

const convertDate = (str) => {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let arr = str.split('-')
  let month = arr[1]
  return arr[1] + ' ' + months[month - 1] + ' ' + arr[0]
}

const setPageIds = (elm, id) => {
  elm.setAttribute('data-page', id)
}

const updateLocalState = () => {
  localStorage.setItem('invoice-data', JSON.stringify(appState))
}

const toElTopo = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

// DOM SELECTORS ========================================
const dropdownContent = _qs('.dropdown-content')
const showInvoice = _qsAll('.single-invoice__arrow')
const invoicesContainer = _qs('.invoices-container')
let invoiceTotal;
let paidBTN;
let toggleTheme = _qs('.header-sun-icon-container')
const siteContent = _qs('.site-content');
const formContainer = _qs('#form-container')
const editFormContainer = _qs('#edit-form-container');
const createNewInvoice = _qs('#create-new-invoice')
const formContent = _qs('.form-content')
const dataSaveBtn = _qs('#data-save')
const dataDiscardBtn = _qs('#data-discard')
const inputText = _qsAll('.input-text')
const editInputText = _qsAll('.edit-input-text')
const addItem = _qs('.add-item')
const editAddItem = _qs('.edit-add-item')
const spinner = _qs('.spinner')
const saveBtn = _qs('.btn-send');
const discardBtn = _qs('.btn-discard');
const editBtnCancel = _qs('.edit-btn-cancel');
const draftBtn = _qs('.btn-draft');
const editBtnUpdate = _qs('.edit-btn-update');
let deleteModalContainer = _qs('.delete-modal-container');
let lineItemsTableRow = _qs('.line-items-table-row')
let inputLabelMsg = _qsAll('.input-label-msg');
let lineItemDelete = _qsAll('.line-item-delete');
let invoiceForm = _qsAll('.invoice-form')

// APP STATE ========================
let appState = [];
let UIState = {
  selectedID: null,
  isEditing: false,
  currentInvoice: {}
}

// HTML ===================================
// NEW BUTTON HEADER BAR ==================
const invoiceHeaderHTML = () => {
  let div = document.createElement('div');
  div.setAttribute('id', 'invoice-header');
  div.setAttribute('class', 'invoice-header');
  let html = `
      <div class="invoice-header-wrapper">
        <div class="invoice-header-container">
          <h2 class="invoice-header-title__title">Invoices</h2>
          <p class="invoice-header-title__amt"><span>7</span> Invoices</p>
        </div>
        <div class="invoice-header-filter-container">
          <h3>Filter <span class="invoice-header-span">by status</span><img src="https://res.cloudinary.com/rjsmedia/image/upload/v1641118944/invoicer/icon-arrow-down_ispveb.svg" alt="arrow"></span></h3>
        </div>
        <div class="invoice-header-button-container">
          <button id="create-new-invoice" class="btn btn-1"><span>+</span> New</button>
        </div>
      </div>`;
  div.innerHTML = html;
  return div;
}

const editLineItemHTML = (item, i) => {
  if (item === false && i === false) {
    item = ''
    i = ''
  }
  return `
  <div class="form-col-5-mod">
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Item Name </label>
          <span class="input-label-msg">can't be empty</span>
        </div>
        <input value="${item.name}" class="edit-input-text edit-line-item-item line-item-name" type="text" name="line-item-name"
          placeholder="Add Item Name">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Qty. </label>
        </div>
        <input value="${item.quantity}" class="edit-input-text edit-line-item-item line-item-qty" type="number" name="line-item-qty"
          placeholder="1">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Price </label>
          <span class="input-label-msg">can't be empty</span>
        </div>
        <input value="${item.price}" class="edit-input-text edit-line-item-item line-item-price" type="text" name="line-item-price"
          placeholder="Add Price">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Line Total </label>
          <span class="input-label-msg">can't be empty</span>
        </div>
        <p class="line-item-total">$${item.total}</p>
      </div>
      <div class="form-group form-group-trash">
        <img id=${i === 0 ? "edit-trash-constant" : i} class="line-item-delete"
          src="https://res.cloudinary.com/rjsmedia/image/upload/v1641118944/invoicer/icon-delete_pvdfsa.svg"
          alt="">
      </div>
    </div>
  `
}

// INITIAL LOADED PAGE INVOICE
let createInvoiceHTML = (item) => {
  let div = document.createElement('div')
  div.className = 'single-invoice show_invoice';
  div.setAttribute('data-invoiceid', item.id)
  let dueDate = convertDate(item.paymentDue)
  let html = `
    <h2 data-invoiceid=${item.id} class="single-invoice__id show_invoice"><span>#</span>${item.id}</h2>
    <p data-invoiceid=${item.id} class="single-invoice__date show_invoice">Due ${dueDate}</p>
    <p data-invoiceid=${item.id} class="single-invoice__vendor-name show_invoice">${item.clientName}</p>
    <h3 data-invoiceid=${item.id} class="single-invoice__amt show_invoice">$${item.total}</h3>
    <p data-invoiceid=${item.id} class="single-invoice__status ${item.status} show_invoice">${item.status}</p>`
  div.innerHTML = html;
  siteContent.appendChild(div)
}

// NEWLY CREATED INVOICE
let getNewInvoiceHTML = (item) => {
  let div = document.createElement('div')
  div.className = 'single-invoice show_invoice';
  div.setAttribute('invoiceid', item.id)
  let dueDate = convertDate(item.paymentDue)
  let html = `
    <h2 data-invoiceid=${item.id} class="single-invoice__id show_invoice"><span>#</span>${item.id}</h2>
    <p data-invoiceid=${item.id} class="single-invoice__date show_invoice">Due ${dueDate}</p>
    <p data-invoiceid=${item.id} class="single-invoice__vendor-name show_invoice">${item.clientName}</p>
    <h3 data-invoiceid=${item.id} class="single-invoice__amt show_invoice">$${item.total}</h3>
    <p data-invoiceid=${item.id} class="single-invoice__status ${item.status} show_invoice">${item.status}</p>`
  div.innerHTML = html;
  return div;
}

const getSingleInvoiceHTML = (invoice) => {
  const {
    clientAddress,
    clientName,
    clientEmail,
    createdAt,
    description,
    id,
    items,
    paymentDue,
    paymentTerms,
    senderAddress,
    status,
    total } = invoice;



  const div = document.createElement('section');
  div.setAttribute('id', 'view-single')
  let html = `
        <div class="view-single-wrapper">
        <div class="view-single-container">  
          <div class="single-invoice-link">
            <h3 id="redirect-home"><span><img src="https://res.cloudinary.com/rjsmedia/image/upload/v1641118944/invoicer/icon-arrow-left_wk96qn.svg" alt="arrow"></span>Go Back</h3>
          </div>
          <div class="status-edit-bar flex">
            <div class="status-edit-bar__status">
              <p class="single-invoice__status--text">Status</p>
              <p class="single-invoice__status ${status}">${status}</p>
            </div>
            <div class="status-edit-bar__edit flex">
              <button id="item-edit" class="btn btn-3-dark" data-id="${id}">Edit</button>
              <button id="item-delete" class="btn btn-5-danger" data-id="${id}">Delete</button>
              ${status === 'paid' ?
      '<button disabled="true" id="mark-paid"  data-id="${id}" class="btn btn-2 btn-fade">Invoice Paid</button>' :

      `<button id="mark-paid"  data-id="${id}" class="btn btn-2">Mark as Paid</button>`}
            </div>
          </div>

          <div class="invoice-summary-master-container">
            <div class="invoice-summary">
              <div class="invoice-summary__header">
                <h2 class="single-invoice__id"><span>#</span>${id}</h2>
                <p class="single-invoice__vendor-type">${description}</p>
              </div>
              <div class="invoice-summary__sender-address">
                <p class="sender-address">${senderAddress.street}</p> 
                <p class="sender-city">${senderAddress.city}</p> 
                <p class="sender-zip">${senderAddress.postCode}</p> 
                <p class="sender-country">${senderAddress.country}</p> 
              </div>
            </div>

            <div class="invoice-summary__details">
              <div class="invoice-summary__dates">
                <p class="invoice-summary__headers">Invoice Date</p>  
                <h2 class="invoice-summary__deats">${convertDate(createdAt)}</h2>
                <p class="invoice-summary__headers">Payment Due</p>  
                <h2 class="invoice-summary__deats">${convertDate(paymentDue)}</h2>
              </div>
              <div class="invoice-summary__bill--to">
                <p class="invoice-summary__headers">Bill To</p>  
                <h2 class="invoice-summary__deats">${clientName}</h2>
                <h3 class="invoice-summary__headers">${clientAddress.street}</h3> 
                <h3 class="invoice-summary__headers">${clientAddress.city}</h3> 
                <h3 class="invoice-summary__headers">${clientAddress.postCode}</h3> 
                <h3 class="invoice-summary__headers">${clientAddress.country}</h3> 
              </div>
              <div class="invoice-summary__sent--to">
                <p class="invoice-summary__headers">Sent to</p>  
                <h2 class="invoice-summary__deats">${clientEmail}</h2>
              </div>
            </div>
          <br>
            <div class="invoice-summary__items">
              <div class="invoice-summary__items--header grid">
                <p>Item Name</p>
                <p>QTY.</p>
                <p>Price</p>
                <p>Total</p>
              </div>
              ${items.map(item => {
        return (
          `<div class="invoice-summary__items--item grid">
                    <p class="job-type">${item.name} ${item.quantity} ${item.price}</p>

                    <p class="single-invoice-total">$${item.total}</p>
                  </div>`
        )
      }).join('')}
            </div>
            <div class="invoice-summary__totals-bar flex">
              <p>Amount Due</p>
              <h2>$657.90</h2>
            </div>
          </div> 
        </div>
      </div>     
  `;
  div.innerHTML = html;
  return div;
}

const createSingleListItemHTML = () => {
  let html = `

      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Item Name </label>
          <span class="input-label-msg">can't be empty</span>
        </div>
        <input class="input-text line-item-item line-item-name" type="text" name="line-item-name"
          placeholder="Add Item Name">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Qty. </label>
        </div>
        <input value="1" class="input-text line-item-item line-item-qty" type="number" name="line-item-qty" placeholder="1">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Price </label>
          <span class="input-label-msg">can't be empty</span>
        </div>
        <input class="input-text line-item-item line-item-price" type="text" name="line-item-price"
          placeholder="Add Price">
      </div>
      <div class="form-group">
        <div class="label-wrap">
          <label class="input-label" for="project-description">Line Total </label>
        </div>
        <p class="line-item-total">$0.00</p>
      </div>
      <div class="form-group form-group-trash">  
        <img class="line-item-delete" src="https://res.cloudinary.com/rjsmedia/image/upload/v1641118944/invoicer/icon-delete_pvdfsa.svg" alt="">
      </div>
  
  `
  const div = document.createElement('div')
  div.classList = 'form-col-5-mod'
  let random = Math.floor(Math.random() * 999999)
  div.setAttribute('data-id', random)
  div.innerHTML = html
  return div
}

// ===============================EVENT LISTENERS =====================================

// =============================NEW INVOICE FORM ==============================
// NEEDS TO BE RESET AFTER SUBMIT REVISIT ===================
let newInvoice = {
  id: generateID(),
  createdAt: null,
  paymentDue: null,
  description: null,
  paymentTerms: null,
  clientName: null,
  clientEmail: null,
  status: "pending",
  senderAddress: {
    street: null,
    city: null,
    postCode: null,
    country: null
  },
  clientAddress: {
    street: null,
    city: null,
    postCode: null,
    country: null
  },
  items: [

  ],
  total: 0
}


const newInvoiceReset = () => {
  newInvoice = {
    id: generateID(),
    createdAt: null,
    paymentDue: null,
    description: null,
    paymentTerms: null,
    clientName: null,
    clientEmail: null,
    status: "pending",
    senderAddress: {
      street: null,
      city: null,
      postCode: null,
      country: null
    },
    clientAddress: {
      street: null,
      city: null,
      postCode: null,
      country: null
    },
    items: [

    ],
    total: 0
  }
}

let tempLineItems = []


const loadPage = (state) => {
  let body = _qs('body');
  setPageIds(body, 'index');
  let invoiceHeader = invoiceHeaderHTML();
  siteContent.appendChild(invoiceHeader)
  let single = state.map((item, i) => {
    createInvoiceHTML(item)
  })
  invoiceTotal = _qs('.invoice-header-title__amt span');
  invoiceTotal.textContent = appState.length
  _qs('.mobile-status-controls').style.display = 'none'
}


const checkForEmpty = (inputElem) => {
  let errors = []
  // ======================GRABBING INPUT ELEMENTS  ======================
  inputElem.forEach((input, i) => {
    let msg = input.previousElementSibling.children[1];
    if (input.value === '') {
      errors.push(input)
      addInputErrorClass(input, 'error')
      addInputErrorClass(msg, 'error')
    }
  })
  // ======================GRABBING DYNAMICALLY ADDED DOM ELEMENTS =======
  let inputLineItem;
  if (UIState.isEditing) {
    inputLineItem = _qsAll('.edit-line-item-item')
  } else {
    inputLineItem = _qsAll('.line-item-item')
  }

  inputLineItem.forEach(item => {
    let msg = item.previousElementSibling.children[1];
    if (item.value === '') {
      errors.push(item)
      addInputErrorClass(item, 'error')
      addInputErrorClass(msg, 'error')
    }
  })
  if (errors.length > 0) {
    _qs('.form-group-title-span').style.opacity = '1';
  } else {
    _qs('.form-group-title-span').style.opacity = '0';
  }
  return errors
}

const addInputErrorClass = (elem, className) => {
  elem.classList.add(className)
  if (elem.previousElementSibling) {
    elem.previousElementSibling.classList.add(className)
  }
}

const removeInputErrorClass = (elem, className) => {
  elem.classList.remove(className)
  if (elem.previousElementSibling.children[1]) {
    elem.previousElementSibling.children[1].classList.remove(className)
  }
}

const updateNewInvoiceState = (obj, input) => {
  let keys = input.name.split('-')
  let lastArrElem = keys[keys.length - 1]
  if (keys.length === 3 && (lastArrElem === 'name' || lastArrElem === 'qty' || lastArrElem === 'price')) {
  } else {
    updateInputItemState(obj, keys, input)
  }

}

const updateInputItemState = (obj, keys, input) => {
  if (keys.length > 1) {
    obj[keys[0]][keys[1]] = input.value
  } else {
    obj[keys[0]] = input.value
  }
}

const showListItemInput = (e) => {
  console.log(UIState.isEditing)
  e.preventDefault()
  const parent = e.target.parentElement.previousElementSibling;
  let newLineItem = createSingleListItemHTML();
  let edit
  if (UIState.isEditing) {
    edit = 'edit-'
  } else {
    edit = ''
  }

  parent.insertAdjacentElement('afterend', newLineItem)
  let allLineItems = _qsAll('.line-item-delete')
  allLineItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.id !== `${edit}trash-constant`) {
        e.target.parentElement.parentElement.remove();
      }
    })
  })
}

const removeErrorsAndUpdateState = (e, cls1, cls2, cls3) => {
  // removeErrorsAndUpdateState(e, 'input-line-item', 'input-text', 'error')
  let input = e.target
  if (input.classList.contains(cls1) || input.classList.contains(cls2)) {
    if (input.classList.contains(cls3) && input.value !== '') {
      removeInputErrorClass(input, cls3)
    }
    updateNewInvoiceState(newInvoice, input)
  }
}

const filterInvoicesBy = (type) => {
  let filteredInvoices = [];
  invoicesContainer.innerHTML = ''
  if (type === 'all') {
    loadPage(appState)
  } else {
    let filteredInvoices = appState.filter(item => item.status === type);
    loadPage(filteredInvoices)
  }
}


const filterItemsSelect = (e) => {
  let type = ''
  if (e.target.classList.contains('dropdown-filter-paid')) {
    type = 'paid'
  } else if (e.target.classList.contains('dropdown-filter-pending')) {
    type = 'pending'
  } else if (e.target.classList.contains('dropdown-filter-draft')) {
    type = 'draft'
  } else {
    type = 'all'
  }
  filterInvoicesBy(type)
}

const updateInvoicePaidUI = (paidBTN) => {
  paidBTN.classList.add('btn-fade')
  paidBTN.disabled = true;
  paidBTN.textContent = 'Invoice Paid'
  paidBTN.style.cursor = 'none';
  let status = document.querySelector('.single-invoice__status');
  status.classList.remove('pending')
  status.classList.add('paid')
  status.textContent = 'paid';
}

const updateStatusState = () => {
  appState.map(item => {
    if (item.id === UIState.currentInvoice.id) {
      return item.status = "paid"
    } else {
      return item;
    }
  })
}

const updateInvoiceBtnStatus = (elmBTN) => {
  if (UIState.currentInvoice.status === 'pending') {
    elmBTN.classList.remove('btn-fade')
    elmBTN.textContent = 'Mark As Paid'
    elmBTN.disabled = false;
  } else if (UIState.currentInvoice.status === 'paid') {
    elmBTN.classList.add('btn-fade')
    elmBTN.textContent = 'Invoice Paid'
    elmBTN.disabled = true;
  } else {
    elmBTN.classList.add('btn-fade')
    elmBTN.textContent = 'Draft Mode'
    elmBTN.disabled = true;
  }
}

const deleteInvoice = () => {
  let filtered = appState.filter(item => item.id !== UIState.currentInvoice.id)
  appState = filtered
  setTimeout(() => {
    siteContent.innerHTML = ''
    loadPage(appState)
  }, 250)
}

const showDeleteConfirm = () => {
  deleteModalContainer.classList.add('show')
}
const hideDeleteConfirm = () => {
  deleteModalContainer.classList.remove('show')
}

const spinnerOn = () => {
  let spinner = _qs('.spinner')
  setTimeout(() => {
    spinner.classList.add('show');
  }, 500)

}
const spinnerOff = () => {
  let spinner = _qs('.spinner')
  setTimeout(() => {
    spinner.classList.remove('show');
  }, 500)
}

const getLineItemsAndAddToObj = () => {
  let tempObj = {}
  let tempArr = [];
  // CONDITONAL CHECK FOR EDITING
  let lineItems = _qsAll('.line-item-item');
  // CONDITONAL CHECK FOR EDITING
  let counter = 0;
  lineItems.forEach((item, i) => {
    if (item.name === 'line-item-qty') {
      tempObj.quantity = item.value;
    }
    if (item.name === 'line-item-name') {
      tempObj.name = item.value;
    }
    if (item.name === 'line-item-price') {
      tempObj.price = item.value;
    }
    counter++
    if (counter === 3) {
      counter = 0;
      tempObj.total = tempObj.quantity * tempObj.price
      tempArr.push(tempObj)
      tempObj = {};
    }
  })
  newInvoice.items = tempArr
}

const clearFormInputs = () => {
  let textInputs = _qsAll('.input-text')
  textInputs.forEach(input => {
    input.value = ''
  })

  let lineItems = _qsAll('.form-col-5-mod');
  lineItems.forEach((item, i) => {
    if (i >= 1) {
      item.remove();
    }
  })

  let leftOvers = _qsAll('.line-item-qty');
  leftOvers.forEach(left => {
    left.value = '1'
  })
  // REMOVE EXTRA LINE ITEMS ==========
}

const getEditFormHTML = () => {
  let street = _qs('#edit-street')
  let city = _qs('#edit-city')
  let zipcode = _qs('#edit-zipcode')
  let country = _qs('#edit-country')
  let clientName = _qs('#edit-client-name')
  let clientEmail = _qs('#edit-client-email')
  let clientAddress = _qs('#edit-client-address')
  let clientCity = _qs('#edit-client-city')
  let clientZip = _qs('#edit-client-zipcode')
  let clientCountry = _qs('#edit-client-country')
  let paymentDue = _qs('#edit-payment-due')
  let projectDescription = _qs('#edit-project-description')
  editFormContainer.classList.remove('hide')
  editFormContainer.classList.add('show')
  street.value = UIState.currentInvoice.senderAddress.street
  city.value = UIState.currentInvoice.senderAddress.city
  zipcode.value = UIState.currentInvoice.senderAddress.postCode
  country.value = UIState.currentInvoice.senderAddress.country
  clientName.value = UIState.currentInvoice.clientName
  clientEmail.value = UIState.currentInvoice.clientEmail
  clientAddress.value = UIState.currentInvoice.clientAddress.street
  clientCity.value = UIState.currentInvoice.clientAddress.city
  clientZip.value = UIState.currentInvoice.clientAddress.postCode
  clientCountry.value = UIState.currentInvoice.clientAddress.country
  paymentDue.value = UIState.currentInvoice.paymentDue
  projectDescription.value = UIState.currentInvoice.description
  if (UIState.currentInvoice.items.length > 0) {
    let container = _qs('.edit-line-items-wrapper');
    UIState.currentInvoice.items.forEach((item, i) => {
      let lineItem = editLineItemHTML(item, i);
      container.insertAdjacentHTML('beforeend', lineItem)
    })
  }
}

const sumLineItems = () => {
  let sumNum = newInvoice.items.map(item => item.price * item.quantity)
  let total = 0;
  sumNum.forEach(item => total += item)
  newInvoice.total = total
}

const setInvoiceToAppState = () => {
  console.log(newInvoice.status)
  getLineItemsAndAddToObj()
  sumLineItems()
  let createdDate = createDate()
  newInvoice.createdAt = createdDate
  appState.unshift(newInvoice)
  console.log(appState)
  localStorage.setItem('invoice-data', JSON.stringify(appState))
  let insertInvoiceToPage = getNewInvoiceHTML(newInvoice);
  let invoiceHeader = document.querySelector('#invoice-header');
  invoiceHeader.insertAdjacentElement('afterend', insertInvoiceToPage);
  toElTopo()
  setTimeout(() => {
    spinner.classList.remove('show')
    formContainer.classList.remove('show')
    formContainer.classList.add('hide')
  }, 500)
  clearFormInputs()
  newInvoiceReset()
}

addItem.addEventListener('click', showListItemInput)
editAddItem.addEventListener('click', showListItemInput)


saveBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const errors = checkForEmpty(inputText)
  if (errors.length > 0) {
    toElTopo()
  }
  if (errors.length === 0 && UIState.isEditing === false) {
    setInvoiceToAppState()
  }
})

discardBtn.addEventListener('click', (e) => {
  e.preventDefault()
  toElTopo()
  formContainer.classList.remove('show')
  formContainer.classList.add('hide')
})

draftBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const errors = checkForEmpty(inputText)
  if (errors.length > 0) {
    toElTopo()
  }
  if (errors.length === 0 && UIState.isEditing === false) {
    newInvoice.status = 'draft'
    setInvoiceToAppState()
  }
})


editBtnUpdate.addEventListener('click', (e) => {
  e.preventDefault()
  let temp = _qsAll('.edit-input-text')
  const errors = checkForEmpty(editInputText)
  if (errors.length > 0) {
    toElTopo()
    console.log('ERRORS')
  } else {
    console.log(UIState.currentInvoice)
    console.log(newInvoice)
    console.log('NO ERRORS')
  }
})

editBtnCancel.addEventListener('click', (e) => {
  e.preventDefault()
  // WIPE OUT LIST ITEMS
  editFormContainer.classList.remove('show')
  editFormContainer.classList.add('hide')
  _qs('.edit-line-items-wrapper').innerHTML = ''
})

siteContent.addEventListener('click', (e) => {
  toElTopo()
  let pageID = _qs('body').dataset.page
  if (e.target.dataset.invoiceid && pageID === 'index') {
    let selectedID = e.target.dataset.invoiceid;
    UIState.selectedID = selectedID;
    let selectedInvoice = getInvoiceByID(selectedID)[0];
    UIState.currentInvoice = selectedInvoice;
    setPageIds(_qs('body'), 'single-invoice');
    let singleInvoice = getSingleInvoiceHTML(UIState.currentInvoice)
    siteContent.innerHTML = '';
    siteContent.appendChild(singleInvoice)

    if (window.innerWidth <= 607) {
      let elmBTN = _qs('#mark-paid-mobile')
      updateInvoiceBtnStatus(elmBTN)
      let mobileControls = _qs('.mobile-status-controls');
      mobileControls.style.display = 'block'
      mobileControls.classList.add('show')
    } else {
      let elmBTN = _qs('#mark-paid')
      updateInvoiceBtnStatus(elmBTN)
    }
  }

  if (e.target.id === 'redirect-home') {
    siteContent.innerHTML = '';
    loadPage(appState)
  }

  if (e.target.id === 'mark-paid') {
    updateStatusState()
    updateLocalState()
    let elmBTN = _qs('#mark-paid')
    updateInvoicePaidUI(elmBTN);
  }

  if (e.target.id === 'item-delete') {
    showDeleteConfirm();
  }
  if (e.target.id === 'create-new-invoice') {
    formContainer.classList.remove('hide')
    formContainer.classList.add('show')
  }

  if (e.target.id === 'item-edit') {
    UIState.isEditing = true
    getEditFormHTML()
  }

})


toggleTheme.addEventListener('click', (e) => {
  let body = document.querySelector('body');
  body.classList.toggle('light')
  if (body.classList.contains('light')) {
    e.target.src = 'https://res.cloudinary.com/rjsmedia/image/upload/v1641118946/invoicer/icon-sun_aaskxo.svg'
  } else {
    e.target.src = 'https://res.cloudinary.com/rjsmedia/image/upload/v1641118946/invoicer/icon-moon_hnybdb.svg'
  }
})




// ========== KEY STROKES ====================
formContainer.addEventListener('keyup', (e) => {
  // IS EDITING SET
  if (UIState.isEditing === false) {
    console.log('IN NEW KEY')
    removeErrorsAndUpdateState(e, 'input-line-item', 'input-text', 'error')
  }
})

// ========== CHANGE ===========================
formContainer.addEventListener('change', (e) => {
  // IS EDITING SET
  if (UIState.isEditing === false) {
    console.log('IN NEW CHANGE')
    removeErrorsAndUpdateState(e, 'input-line-item', 'input-text', 'error')
  }
})

editFormContainer.addEventListener('change', (e) => {
  console.log('IN EDITING CHANGE')
  if (UIState.isEditing === true) {
    removeErrorsAndUpdateState(e, 'edit-line-item-item', 'edit-input-text', 'error')
  }
})
editFormContainer.addEventListener('keyup', (e) => {
  console.log('IN EDITING KEYUP')
  if (UIState.isEditing === true) {
    removeErrorsAndUpdateState(e, 'edit-line-item-item', 'edit-input-text', 'error')
  }
})



// ========================== INITIAL DATA LOADING ==============================

document.body.addEventListener('click', (e) => {
  let pageID = _qs('body').dataset.page
  if (e.target.id === 'mark-paid-mobile' && pageID !== 'index') {
    updateStatusState()
    updateLocalState()
    let elmBTN = _qs('#mark-paid-mobile')
    updateInvoicePaidUI(elmBTN);
  }

  if (e.target.id === 'item-delete-mobile' && pageID !== 'index') {
    toElTopo()
    showDeleteConfirm();
  }

  if (e.target.id === 'item-edit-mobile' && pageID !== 'index') {
    getEditFormHTML()
  }

  if (e.target.dataset.action === 'cancel') {
    hideDeleteConfirm()
  }
  if (e.target.dataset.action === 'delete') {
    setTimeout(() => {
      hideDeleteConfirm()
    }, 50)
    deleteInvoice()
    updateLocalState()
  }


})




// IF WINDOW IS RESIZED AND ON  PROPER PAGE -----> ADD MOBILE CONTROLS
window.addEventListener('resize', () => {
  let mobileControls = _qs('.mobile-status-controls');
  let pageID = _qs('body').dataset.page
  if (window.innerWidth <= 607 && pageID !== 'index') {
    let elmBTN = _qs('#mark-paid-mobile')
    updateInvoiceBtnStatus(elmBTN)
    mobileControls.classList.add('show')
    mobileControls.style.display = 'block'
  } else if (window.innerWidth >= 607 && pageID !== 'index') {
    let elmBTN = _qs('#mark-paid')
    updateInvoiceBtnStatus(elmBTN)
    mobileControls.classList.remove('show')
    mobileControls.style.display = 'none'
  }
})


window.addEventListener('load', (event) => {
  const url = './data.json'
  let invoiceData = localStorage.getItem('invoice-data')
  if (invoiceData) {
    let localData = JSON.parse(invoiceData)
    appState = localData
    loadPage(appState)
  } else {
    async function loadData() {
      const response = await fetch(url);
      const inventory = await response.json();
      inventory.map(item => {
        appState.push(item)
      })
      localStorage.setItem('invoice-data', JSON.stringify(appState))
      loadPage(appState)
    }
    loadData()
  }
});


// ================================ EVENTS LISTENERS ========================================================




// dataDiscardBtn.addEventListener('click', (e) => {
//   tempLineItems = []
//   newInvoice.items = []
//   inputText.forEach(input => {
//     input.value = ''
//     removeInputErrorClass(input, 'error')
//   })

//   _qsAll('.input-line-item').forEach(line => {
//     line.value = ''
//     removeInputErrorClass(line, 'error')
//   })
//   _qsAll('.line-item-inputs').forEach(input => {
//     input.remove()
//   })

//   spinner.classList.add('show')
//   setTimeout(() => {
//     spinner.classList.remove('show')
//     formContainer.classList.remove('show')
//     formContent.classList.remove('show')
//     window.scrollTo(0, 0)
//   }, 500)
// })




// dropdownContent.addEventListener('click', filterItemsSelect)






