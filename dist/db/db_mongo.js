"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.clear_db_mongo = exports.runMongo = exports.collectionUsers = exports.collectionPosts = exports.collectionBlogs = exports.clientMongo = exports.MONGO_URL = void 0;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.MONGO_URL = process.env.MONGO_URL;
if (!exports.MONGO_URL) {
    throw new Error('!!! Bad URL');
}
exports.clientMongo = new mongodb_1.MongoClient(exports.MONGO_URL);
exports.collectionBlogs = exports.clientMongo.db('back-end-course').collection('Blogs');
exports.collectionPosts = exports.clientMongo.db('back-end-course').collection('Posts');
exports.collectionUsers = exports.clientMongo.db('back-end-course').collection('Users');
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
        yield exports.collectionPosts.deleteMany({});
        return true;
    });
}
exports.clear_db_mongo = clear_db_mongo;
//# sourceMappingURL=db_mongo.js.map