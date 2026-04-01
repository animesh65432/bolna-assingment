"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncerrorhandler = void 0;
const asyncerrorhandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    };
};
exports.asyncerrorhandler = asyncerrorhandler;
