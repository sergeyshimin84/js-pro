'use strict'

const str = document.getElementsByTagName("p")['0'].textContent;
const newstr = str.replace(/ \'/g, ' \"');
const newstr2 = newstr.replace(/\' /g, '\" ');
console.log(newstr2);
