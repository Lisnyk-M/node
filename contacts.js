const fs = require('fs');
const path = require('path');
const { getMaxListeners } = require('process');

const fileName = 'contacts.json';

const contactsPath = path.join('./', 'db', fileName);


const fsWriteFile = (data) => {
    const strData = JSON.stringify(data, null, '  ');
    fs.writeFile(contactsPath, strData, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

const fsReadFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (error, data) => {
            if (!error && data) {
                resolve(JSON.parse(data))
            } else {
                reject(error);
            }
        });
    })
}

function listContacts() {
    fsReadFile(contactsPath).then(res => {
        console.table(res);
    });
}

function getContactById(contactId) {
    fsReadFile(contactsPath).then(res => {
        const contact = res.filter(el => el.id === contactId);
        console.table(contact);
    });

}

function removeContact(contactId) {
    fsReadFile(contactsPath).then(res => {
        const contact = res.filter(el => el.id !== contactId);
        fsWriteFile(contact);
    });
}

function addContact(name, email, phone) {
    let maxId = 0;

    fsReadFile(contactsPath).then(res => {
        res.forEach(element => {
            if (element.id > maxId) {maxId = element.id} 
        });
        const id = maxId + 1;
        const data = [...res, {id, name, email, phone }];
        fsWriteFile(data);        
    });
}

module.exports = { listContacts, getContactById, removeContact, addContact }