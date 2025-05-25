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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.TrelloClient = void 0;
var axios_1 = require("axios");
var rate_limiter_js_1 = require("./rate-limiter.js");
var fs = require("fs/promises");
var path = require("path");
// Path for storing active board/workspace configuration
var CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.trello-mcp');
var CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
var TrelloClient = /** @class */ (function () {
    function TrelloClient(config) {
        var _this = this;
        this.config = config;
        this.activeConfig = __assign({}, config);
        this.axiosInstance = axios_1.default.create({
            baseURL: 'https://api.trello.com/1',
            params: {
                key: config.apiKey,
                token: config.token,
            },
        });
        this.rateLimiter = (0, rate_limiter_js_1.createTrelloRateLimiters)();
        // Add rate limiting interceptor
        this.axiosInstance.interceptors.request.use(function (config) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rateLimiter.waitForAvailableToken()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, config];
                }
            });
        }); });
    }
    /**
     * Load saved configuration from disk
     */
    TrelloClient.prototype.loadConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, savedConfig, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs.mkdir(CONFIG_DIR, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.readFile(CONFIG_FILE, 'utf8')];
                    case 2:
                        data = _a.sent();
                        savedConfig = JSON.parse(data);
                        // Only update boardId and workspaceId, keep credentials from env
                        if (savedConfig.boardId) {
                            this.activeConfig.boardId = savedConfig.boardId;
                        }
                        if (savedConfig.workspaceId) {
                            this.activeConfig.workspaceId = savedConfig.workspaceId;
                        }
                        console.log("Loaded configuration: Board ID ".concat(this.activeConfig.boardId, ", Workspace ID ").concat(this.activeConfig.workspaceId || 'not set'));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // File might not exist yet, that's okay
                        if (error_1 instanceof Error && 'code' in error_1 && error_1.code !== 'ENOENT') {
                            throw error_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save current configuration to disk
     */
    TrelloClient.prototype.saveConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configToSave, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs.mkdir(CONFIG_DIR, { recursive: true })];
                    case 1:
                        _a.sent();
                        configToSave = {
                            boardId: this.activeConfig.boardId,
                            workspaceId: this.activeConfig.workspaceId,
                        };
                        return [4 /*yield*/, fs.writeFile(CONFIG_FILE, JSON.stringify(configToSave, null, 2))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Failed to save configuration:', error_2);
                        throw new Error('Failed to save configuration');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(TrelloClient.prototype, "activeBoardId", {
        /**
         * Get the current active board ID
         */
        get: function () {
            return this.activeConfig.boardId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TrelloClient.prototype, "activeWorkspaceId", {
        /**
         * Get the current active workspace ID
         */
        get: function () {
            return this.activeConfig.workspaceId;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set the active board
     */
    TrelloClient.prototype.setActiveBoard = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBoardById(boardId)];
                    case 1:
                        board = _a.sent();
                        this.activeConfig.boardId = boardId;
                        return [4 /*yield*/, this.saveConfig()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, board];
                }
            });
        });
    };
    /**
     * Set the active workspace
     */
    TrelloClient.prototype.setActiveWorkspace = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var workspace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWorkspaceById(workspaceId)];
                    case 1:
                        workspace = _a.sent();
                        this.activeConfig.workspaceId = workspaceId;
                        return [4 /*yield*/, this.saveConfig()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, workspace];
                }
            });
        });
    };
    TrelloClient.prototype.handleRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 6]);
                        return [4 /*yield*/, request()];
                    case 1: return [2 /*return*/, _e.sent()];
                    case 2:
                        error_3 = _e.sent();
                        if (!axios_1.default.isAxiosError(error_3)) return [3 /*break*/, 5];
                        if (!(((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status) === 429)) return [3 /*break*/, 4];
                        // Rate limit exceeded, wait and retry
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        // Rate limit exceeded, wait and retry
                        _e.sent();
                        return [2 /*return*/, this.handleRequest(request)];
                    case 4: throw new Error("Trello API error: ".concat((_d = (_c = (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : error_3.message));
                    case 5: throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all boards the user has access to
     */
    TrelloClient.prototype.listBoards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get('/members/me/boards')];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Get a specific board by ID
     */
    TrelloClient.prototype.getBoardById = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/boards/".concat(boardId))];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * List all workspaces the user has access to
     */
    TrelloClient.prototype.listWorkspaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get('/members/me/organizations')];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Get a specific workspace by ID
     */
    TrelloClient.prototype.getWorkspaceById = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/organizations/".concat(workspaceId))];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * List boards in a specific workspace
     */
    TrelloClient.prototype.listBoardsInWorkspace = function (workspaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/organizations/".concat(workspaceId, "/boards"))];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.getCardsByList = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/lists/".concat(listId, "/cards"))];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.getLists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/boards/".concat(this.activeConfig.boardId, "/lists"))];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.getRecentActivity = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var _this = this;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get("/boards/".concat(this.activeConfig.boardId, "/actions"), {
                                        params: { limit: limit },
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.addCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.post('/cards', {
                                        idList: params.listId,
                                        name: params.name,
                                        desc: params.description,
                                        due: params.dueDate,
                                        idLabels: params.labels,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.updateCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.put("/cards/".concat(params.cardId), {
                                        name: params.name,
                                        desc: params.description,
                                        due: params.dueDate,
                                        idLabels: params.labels,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.archiveCard = function (cardId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.put("/cards/".concat(cardId), {
                                        closed: true,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.moveCard = function (cardId, listId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.put("/cards/".concat(cardId), {
                                        idList: listId,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.addList = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.post('/lists', {
                                        name: name,
                                        idBoard: this.activeConfig.boardId,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.archiveList = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.put("/lists/".concat(listId, "/closed"), {
                                        value: true,
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.getMyCards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.get('/members/me/cards')];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    TrelloClient.prototype.attachImageToCard = function (cardId, imageUrl, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.handleRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.axiosInstance.post("/cards/".concat(cardId, "/attachments"), {
                                        url: imageUrl,
                                        name: name || 'Image Attachment',
                                    })];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            });
        });
    };
    return TrelloClient;
}());
exports.TrelloClient = TrelloClient;
