"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear_db_mongo = exports.runMongo = exports.collectionPosts = exports.collectionBlogs = exports.clientMongo = void 0;
const mongodb_1 = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
// @ts-ignore
const URL = "mongodb+srv://kvstreltsov:ksdSrQnLnkqsLiwF@cluster0.34z5sen.mongodb.net/back-end-course?retryWrites=true&w=majority";
exports.clientMongo = new mongodb_1.MongoClient(URL);
exports.collectionBlogs = exports.clientMongo.db('back-end-course').collection('Blogs');
exports.collectionPosts = exports.clientMongo.db('back-end-course').collection('Posts');
function runMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.clientMongo.connect();
            yield exports.clientMongo.db("Back-end-course").command({ ping: 1 });
            console.log('connected successfully to mongo server');
        }
        catch (_a) {
            yield exports.clientMongo.close();
            console.log('connect error to mongo server');
        }
    });
}
exports.runMongo = runMongo;
function clear_db_mongo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.collectionBlogs.deleteMany({});
    });
}
exports.clear_db_mongo = clear_db_mongo;
//# sourceMappingURL=db_mongo.js.map