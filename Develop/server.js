const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

//async processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);