const fs = require('fs');
const path = require('path');

const pathToDb = path.join(__dirname, '..', '..', 'db', 'contacts.json');

class ContactsService {
    getContacts() {
        return new Promise((res, rej) => {
            fs.readFile(pathToDb, (err, data) => {
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
        return this.fsWriteFile (data, pathToDb, 'Contact created.');
    }

    updateContact(data) {
        return this.fsWriteFile (data, pathToDb, 'Contact updated.');
    }

    deleteContact(data) {
        return this.fsWriteFile (data, pathToDb, 'Contact deleted.');
    }
}

module.exports = new ContactsService();