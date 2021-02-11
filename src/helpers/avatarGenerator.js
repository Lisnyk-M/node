const fs = require('fs').promises;
const path = require('path');
const { generateFromString } = require('generate-avatar');

const generateAvatar = async string => {
    const generated = generateFromString(string);
    const combinePath = path.join(__dirname, '../../tmp', '/tmp.svg');
    await fs.writeFile(combinePath, generated);
}

module.exports = generateAvatar;
