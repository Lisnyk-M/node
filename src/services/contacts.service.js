const fs = require('fs')

class ContactsService {
    getContacts() {
        return new Promise((res, rej) => {
            fs.readFile('./src/contacts.json', (err, data) => {
                if (err) {
                    console.log('err: ', err);
                    return res(false)
                }
                return res(JSON.parse(data))
            })
        })
    }

    fsWriteFile (data, fileName, message) {
        return new Promise((res, rej) => {
            fs.writeFile(
                fileName,
                JSON.stringify(data, null, '  '),
                (err, response) => {
                    if (err) return res(false)

                    return res({ message: message })
                }
            )
        })        
    }

    createContact(data) {
        return this.fsWriteFile (data, './src/contacts.json', 'Contact created.');
    }

    updateContact(data) {
        return this.fsWriteFile (data, './src/contacts.json', 'Contact updated.');
    }

    deleteContact(data) {
        return this.fsWriteFile (data, './src/contacts.json', 'Contact deleted.');
    }
}

module.exports = new ContactsService();