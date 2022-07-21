require('dotenv').config();
const cheerio = require('cheerio');
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});

