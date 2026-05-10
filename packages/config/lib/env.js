"use strict";
var _a;
exports.__esModule = true;
exports.config = exports.file = void 0;
var fs = require("fs-extra");
var path = require("path");
var dotenv = require('dotenv');
var isProd = process.env.NODE_ENV === 'production';
function parseEnv() {
    var envFiles = [
        isProd ? path.resolve(__dirname, '../../../.env.prod') : '',
        path.resolve(__dirname, '../../../.env.local'),
        path.resolve(__dirname, '../../../.env')
    ].filter(Boolean);
    var file = envFiles.find(function (envFile) { return fs.existsSync(envFile); });
    if (!file) {
        throw new Error("Can not locate any .env file in ".concat(__dirname));
    }
    var config = dotenv.parse(fs.readFileSync(file));
    return { file: file, config: config };
}
exports.file = (_a = parseEnv(), _a.file), exports.config = _a.config;
