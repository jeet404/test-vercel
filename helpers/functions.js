const moment = require('moment')

// create current timestamp
const currentTimestamp = () => moment().unix()

// generate random 6 digit number
const generateOtp = () => Math.floor(100000 + Math.random() * 900000)

// sql timestamp
const createTimeStamp = () => moment().unix() + 600

//find common elements
const findCommonElements = (arr1, arr2) => arr1.filter(ele1 => arr2.some(ele2 => ele2 == ele1));

//remove common elements
const removeCommonElements = (arr1, arr2) => arr1.filter(function (obj) { return arr2.indexOf(obj) == -1; });

module.exports = {
    currentTimestamp,
    createTimeStamp,
    generateOtp,
    findCommonElements,
    removeCommonElements
}