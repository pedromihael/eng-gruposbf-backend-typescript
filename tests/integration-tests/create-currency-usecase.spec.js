"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var create_currency_usecase_1 = require("../../src/usecases/create-currency-usecase");
var currencies_repository_1 = require("../../src/interface-adapters/gateways/repositories/fake/currencies.repository");
var index_1 = require("../../src/entities/constants/index");
var uuidv4_1 = require("uuidv4");
var createCurrencyUseCase;
var fakeRepository;
describe('CreateCurrencyUseCase', function () {
    beforeAll(function () {
        fakeRepository = new currencies_repository_1.CurrenciesFakeRepository();
    });
    beforeEach(function () {
        createCurrencyUseCase = new create_currency_usecase_1.CreateCurrencyUseCase(fakeRepository);
    });
    it('should create a currency object if body is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = (0, uuidv4_1.uuid)();
                    body = {
                        id: id,
                        code: "CAD",
                        active: true,
                    };
                    return [4 /*yield*/, createCurrencyUseCase.execute(body)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 200,
                        response: body,
                    };
                    expect(result).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not create a currency object if body is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var partialExpectedResultObject, body2, body3, body4, expectedResult1, expectedResult2, expectedResult3, expectedResult4, result1, result2, result3, result4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    partialExpectedResultObject = {
                        status: 400,
                    };
                    body2 = {
                        code: 999,
                        active: true,
                    };
                    body3 = {
                        code: "Bitcoin",
                        active: true,
                    };
                    body4 = {
                        code: "BRL",
                        active: "true",
                    };
                    expectedResult1 = __assign(__assign({}, partialExpectedResultObject), { response: { message: index_1.constants.errors.userErrors.MISSING_REQUEST_BODY } });
                    expectedResult2 = __assign(__assign({}, partialExpectedResultObject), { response: { message: "".concat(index_1.constants.errors.userErrors.WRONG_PARAM_TYPE, ": 'code' expected to be string - received number") } });
                    expectedResult3 = __assign(__assign({}, partialExpectedResultObject), { response: { message: index_1.constants.errors.userErrors.CODE_NOT_SUPPORTED } });
                    expectedResult4 = __assign(__assign({}, partialExpectedResultObject), { response: { message: "".concat(index_1.constants.errors.userErrors.WRONG_PARAM_TYPE, ": 'active' expected to be boolean - received string") } });
                    return [4 /*yield*/, createCurrencyUseCase.execute(null)];
                case 1:
                    result1 = _a.sent();
                    expect(result1).toEqual(expectedResult1);
                    return [4 /*yield*/, createCurrencyUseCase.execute(body2)];
                case 2:
                    result2 = _a.sent();
                    expect(result2).toEqual(expectedResult2);
                    return [4 /*yield*/, createCurrencyUseCase.execute(body3)];
                case 3:
                    result3 = _a.sent();
                    expect(result3).toEqual(expectedResult3);
                    return [4 /*yield*/, createCurrencyUseCase.execute(body4)];
                case 4:
                    result4 = _a.sent();
                    expect(result4).toEqual(expectedResult4);
                    return [2 /*return*/];
            }
        });
    }); });
});
