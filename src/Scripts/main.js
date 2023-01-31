
const BASE_URL = 'http://localhost:3000/contacts'
window.onload = () => {
    let tbody = document.querySelector('#tbody')
    // Get Data From Server And Fill the Table When Page Loaded
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            data.forEach(contact => {
                createTDElement(contact, tbody)
            });
        })
        .catch(err => console.log(err))
    // Add addEventListener to Save contact Button 
    let saveContact = document.querySelector('#saveContact')
    saveContact.addEventListener('click', () => {
        createNewContact();
    })
}
// create a new contact Function
function createNewContact() {
    let nameField = document.querySelector('#nameField')
    let phoneField = document.querySelector('#phoneField')
    let emailField = document.querySelector('#emailField')

    console.log(nameField.value);
    let contact = {
        "name": nameField.value,
        "phone": phoneField.value,
        "email": emailField.value
    }
    fetch(BASE_URL, {
        method: "POST",
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
        .then(res => res.json())
        .then(data => {
            let tbody = document.querySelector('tbody')
            createTDElement(data, tbody)

            nameField.value = ''
            phoneField.value = ''
            emailField.value = ''
        })
        .catch(err => console.log(err))
}
// createing A TR Element and Appending to it's parent Element
function createTDElement(contact, parentElement) {
    const TR = document.createElement('tr');
    const tdName = document.createElement('td')
    tdName.innerHTML = contact.name;
    TR.appendChild(tdName)
    const tdPhone = document.createElement('td')
    tdPhone.innerHTML = contact.phone ? contact.phone : 'N/A';
    TR.appendChild(tdPhone)
    const tdEmail = document.createElement('td')
    tdEmail.innerHTML = contact.email ? contact.email : 'N/A';
    TR.appendChild(tdEmail)
    const tdActions = document.createElement('td')
    const tdEditBtn = document.createElement('button')
    tdEditBtn.className = 'btn btn-warning mx-1'
    tdEditBtn.innerHTML = 'Edit'
    tdEditBtn.addEventListener('click', () => {
        const myModal = new bootstrap.Modal('#contactEditModal')
        myModal.show()
        let editName =document.querySelector('#edit-name');
        let editPhone =document.querySelector('#edit-phone');
        let editEmail =document.querySelector('#edit-email');

        editName.value =contact.name;
        editPhone.value =contact.phone ?contact.phone :''
        editEmail.value=contact.email ?contact.email :''

        let updateBtn =document.querySelector('#updateContact');
        updateBtn.addEventListener('click',function(){
            let updateContacts = {
                "name": editName.value,
                "phone": editPhone.value,
                "email": editEmail.value
            }
            fetch(BASE_URL + "/" + contact.id, {
                method:'PUT',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify(updateContacts)
            })
            .then(res=> res.json())
            .then(data =>{
                tdName.innerHTML =data.name
                tdPhone.innerHTML =data.phone
                tdEmail.innerHTML =data.email

                myModal.hide()
            })
            .catch(err=> console.log(err))
        })
    })
    tdActions.appendChild(tdEditBtn)
    const tdDeleteBtn = document.createElement('button')
    tdDeleteBtn.className = 'btn btn-danger'
    tdDeleteBtn.innerHTML = 'Delete'
    tdDeleteBtn.addEventListener('click', () => {
        fetch(BASE_URL + "/" + contact.id, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                parentElement.removeChild(TR)
            })
            .catch(err => console.log(err))
    })
    tdActions.appendChild(tdDeleteBtn)
    TR.appendChild(tdActions)

    parentElement.appendChild(TR)
}