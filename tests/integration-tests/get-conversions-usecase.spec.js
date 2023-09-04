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
var conversion_mock_api_adapter_1 = require("../../src/interface-adapters/gateways/adapters/mock/conversion-mock-api-adapter");
var get_conversions_usecase_1 = require("../../src/usecases/get-conversions-usecase");
var converters_facade_1 = require("../../src/interface-adapters/gateways/facade/converters-facade");
var index_1 = require("../../src/entities/constants/index");
var currencies_repository_1 = require("../../src/interface-adapters/gateways/repositories/fake/currencies.repository");
var CreateCurrencyUseCase;
var fakeRepository;
var convertersMockAdapter;
var convertersFacade;
var getConversionsUseCase;
var SHOULD_FAIL = true;
describe('GetConversionsUseCase', function () {
    beforeAll(function () {
        fakeRepository = new currencies_repository_1.CurrenciesFakeRepository();
    });
    beforeEach(function () {
        convertersMockAdapter = new conversion_mock_api_adapter_1.ConversionMockAPIAdapter();
        convertersFacade = new converters_facade_1.ConvertersFacade([convertersMockAdapter], fakeRepository);
        getConversionsUseCase = new get_conversions_usecase_1.GetConversionsUseCase(convertersFacade);
    });
    it('should return a list of conversions of a given numerical amount', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        value: 999
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body)];
                case 1:
                    result = _a.sent();
                    console.log('result', result);
                    expectedResult = {
                        status: 200,
                        response: {
                            EUR: 5264.73,
                            INR: 58.94,
                            USD: 4865.13,
                        },
                    };
                    expect(expectedResult).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error message if the input to convert is not numerical', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        value: "999"
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body, SHOULD_FAIL)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 418,
                        response: {
                            message: index_1.constants.errors.userErrors.NON_NUMERICAL_VALUE
                        },
                    };
                    expect(result).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error message if the service is down', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        value: 999
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body, SHOULD_FAIL)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 503,
                        response: {
                            message: index_1.constants.errors.serverErrors.EXTERNAL_SERVICE_DOWN,
                        },
                    };
                    expect(result).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error message if the input body has not `value` field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        invalid: 'body'
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 422,
                        response: {
                            message: index_1.constants.errors.userErrors.MISSING_VALUE_OR_BASE_CURRENCY
                        },
                    };
                    expect(result).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error message if the input body has wrong `baseCurrency` field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        value: 999,
                        baseCurrency: 888
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 422,
                        response: {
                            message: index_1.constants.errors.userErrors.MISSING_VALUE_OR_BASE_CURRENCY
                        },
                    };
                    expect(result).toEqual(expectedResult);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error message if the input body has invalid `baseCurrency` field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, result, expectedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        value: 999,
                        baseCurrency: 888
                    };
                    return [4 /*yield*/, getConversionsUseCase.execute(body)];
                case 1:
                    result = _a.sent();
                    expectedResult = {
                        status: 422,
                    };
                    expect(result.status).toEqual(422);
                    return [2 /*return*/];
            }
        });
    }); });
});
