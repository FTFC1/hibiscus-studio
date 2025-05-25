#!/usr/bin/env node
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
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var trello_client_js_1 = require("./trello-client.js");
var validators_js_1 = require("./validators.js");
var TrelloServer = /** @class */ (function () {
    function TrelloServer() {
        var _this = this;
        var apiKey = process.env.TRELLO_API_KEY;
        var token = process.env.TRELLO_TOKEN;
        var boardId = process.env.TRELLO_BOARD_ID;
        if (!apiKey || !token || !boardId) {
            throw new Error('TRELLO_API_KEY, TRELLO_TOKEN, and TRELLO_BOARD_ID environment variables are required');
        }
        this.trelloClient = new trello_client_js_1.TrelloClient({ apiKey: apiKey, token: token, boardId: boardId });
        this.server = new index_js_1.Server({
            name: 'trello-server',
            version: '0.3.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = function (error) { return console.error('[MCP Error]', error); };
        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.server.close()];
                    case 1:
                        _a.sent();
                        process.exit(0);
                        return [2 /*return*/];
                }
            });
        }); });
    }
    TrelloServer.prototype.setupToolHandlers = function () {
        var _this = this;
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        tools: [
                            {
                                name: 'get_cards_by_list_id',
                                description: 'Fetch cards from a specific Trello list',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        listId: {
                                            type: 'string',
                                            description: 'ID of the Trello list',
                                        },
                                    },
                                    required: ['listId'],
                                },
                            },
                            {
                                name: 'get_lists',
                                description: 'Retrieve all lists from the specified board',
                                inputSchema: {
                                    type: 'object',
                                    properties: {},
                                    required: [],
                                },
                            },
                            {
                                name: 'get_recent_activity',
                                description: 'Fetch recent activity on the Trello board',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        limit: {
                                            type: 'number',
                                            description: 'Number of activities to fetch (default: 10)',
                                        },
                                    },
                                    required: [],
                                },
                            },
                            {
                                name: 'add_card_to_list',
                                description: 'Add a new card to a specified list',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        listId: {
                                            type: 'string',
                                            description: 'ID of the list to add the card to',
                                        },
                                        name: {
                                            type: 'string',
                                            description: 'Name of the card',
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Description of the card',
                                        },
                                        dueDate: {
                                            type: 'string',
                                            description: 'Due date for the card (ISO 8601 format)',
                                        },
                                        labels: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                            description: 'Array of label IDs to apply to the card',
                                        },
                                    },
                                    required: ['listId', 'name'],
                                },
                            },
                            {
                                name: 'update_card_details',
                                description: 'Update an existing card\'s details',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        cardId: {
                                            type: 'string',
                                            description: 'ID of the card to update',
                                        },
                                        name: {
                                            type: 'string',
                                            description: 'New name for the card',
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'New description for the card',
                                        },
                                        dueDate: {
                                            type: 'string',
                                            description: 'New due date for the card (ISO 8601 format)',
                                        },
                                        labels: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                            description: 'New array of label IDs for the card',
                                        },
                                    },
                                    required: ['cardId'],
                                },
                            },
                            {
                                name: 'archive_card',
                                description: 'Send a card to the archive',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        cardId: {
                                            type: 'string',
                                            description: 'ID of the card to archive',
                                        },
                                    },
                                    required: ['cardId'],
                                },
                            },
                            {
                                name: 'move_card',
                                description: 'Move a card to a different list',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        cardId: {
                                            type: 'string',
                                            description: 'ID of the card to move',
                                        },
                                        listId: {
                                            type: 'string',
                                            description: 'ID of the target list',
                                        },
                                    },
                                    required: ['cardId', 'listId'],
                                },
                            },
                            {
                                name: 'add_list_to_board',
                                description: 'Add a new list to the board',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Name of the new list',
                                        },
                                    },
                                    required: ['name'],
                                },
                            },
                            {
                                name: 'archive_list',
                                description: 'Send a list to the archive',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        listId: {
                                            type: 'string',
                                            description: 'ID of the list to archive',
                                        },
                                    },
                                    required: ['listId'],
                                },
                            },
                            {
                                name: 'get_my_cards',
                                description: 'Fetch all cards assigned to the current user',
                                inputSchema: {
                                    type: 'object',
                                    properties: {},
                                    required: [],
                                },
                            },
                            {
                                name: 'attach_image_to_card',
                                description: 'Attach an image to a card directly from a URL',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        cardId: {
                                            type: 'string',
                                            description: 'ID of the card to attach the image to',
                                        },
                                        imageUrl: {
                                            type: 'string',
                                            description: 'URL of the image to attach',
                                        },
                                        name: {
                                            type: 'string',
                                            description: 'Optional name for the attachment (defaults to "Image Attachment")',
                                        },
                                    },
                                    required: ['cardId', 'imageUrl'],
                                },
                            },
                            {
                                name: 'list_boards',
                                description: 'List all boards the user has access to',
                                inputSchema: {
                                    type: 'object',
                                    properties: {},
                                    required: [],
                                },
                            },
                            {
                                name: 'set_active_board',
                                description: 'Set the active board for future operations',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        boardId: {
                                            type: 'string',
                                            description: 'ID of the board to set as active',
                                        },
                                    },
                                    required: ['boardId'],
                                },
                            },
                            {
                                name: 'list_workspaces',
                                description: 'List all workspaces the user has access to',
                                inputSchema: {
                                    type: 'object',
                                    properties: {},
                                    required: [],
                                },
                            },
                            {
                                name: 'set_active_workspace',
                                description: 'Set the active workspace for future operations',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        workspaceId: {
                                            type: 'string',
                                            description: 'ID of the workspace to set as active',
                                        },
                                    },
                                    required: ['workspaceId'],
                                },
                            },
                            {
                                name: 'list_boards_in_workspace',
                                description: 'List all boards in a specific workspace',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        workspaceId: {
                                            type: 'string',
                                            description: 'ID of the workspace to list boards from',
                                        },
                                    },
                                    required: ['workspaceId'],
                                },
                            },
                            {
                                name: 'get_active_board_info',
                                description: 'Get information about the currently active board',
                                inputSchema: {
                                    type: 'object',
                                    properties: {},
                                    required: [],
                                },
                            },
                        ],
                    })];
            });
        }); });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var args, _a, validArgs, cards, lists, validArgs, activity, validArgs, card, validArgs, card, validArgs, card, validArgs, card, validArgs, list, validArgs, list, cards, validArgs, attachment, error_1, boards, validArgs, board, error_2, workspaces, validArgs, workspace, error_3, validArgs, boards, error_4, boardId, board, error_5, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 46, , 47]);
                        if (!request.params.arguments) {
                            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'Missing arguments');
                        }
                        args = request.params.arguments;
                        _a = request.params.name;
                        switch (_a) {
                            case 'get_cards_by_list_id': return [3 /*break*/, 1];
                            case 'get_lists': return [3 /*break*/, 3];
                            case 'get_recent_activity': return [3 /*break*/, 5];
                            case 'add_card_to_list': return [3 /*break*/, 7];
                            case 'update_card_details': return [3 /*break*/, 9];
                            case 'archive_card': return [3 /*break*/, 11];
                            case 'move_card': return [3 /*break*/, 13];
                            case 'add_list_to_board': return [3 /*break*/, 15];
                            case 'archive_list': return [3 /*break*/, 17];
                            case 'get_my_cards': return [3 /*break*/, 19];
                            case 'attach_image_to_card': return [3 /*break*/, 21];
                            case 'list_boards': return [3 /*break*/, 25];
                            case 'set_active_board': return [3 /*break*/, 27];
                            case 'list_workspaces': return [3 /*break*/, 31];
                            case 'set_active_workspace': return [3 /*break*/, 33];
                            case 'list_boards_in_workspace': return [3 /*break*/, 37];
                            case 'get_active_board_info': return [3 /*break*/, 41];
                        }
                        return [3 /*break*/, 44];
                    case 1:
                        validArgs = (0, validators_js_1.validateGetCardsListRequest)(args);
                        return [4 /*yield*/, this.trelloClient.getCardsByList(validArgs.listId)];
                    case 2:
                        cards = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(cards, null, 2) }],
                            }];
                    case 3: return [4 /*yield*/, this.trelloClient.getLists()];
                    case 4:
                        lists = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(lists, null, 2) }],
                            }];
                    case 5:
                        validArgs = (0, validators_js_1.validateGetRecentActivityRequest)(args);
                        return [4 /*yield*/, this.trelloClient.getRecentActivity(validArgs.limit)];
                    case 6:
                        activity = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(activity, null, 2) }],
                            }];
                    case 7:
                        validArgs = (0, validators_js_1.validateAddCardRequest)(args);
                        return [4 /*yield*/, this.trelloClient.addCard(validArgs)];
                    case 8:
                        card = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
                            }];
                    case 9:
                        validArgs = (0, validators_js_1.validateUpdateCardRequest)(args);
                        return [4 /*yield*/, this.trelloClient.updateCard(validArgs)];
                    case 10:
                        card = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
                            }];
                    case 11:
                        validArgs = (0, validators_js_1.validateArchiveCardRequest)(args);
                        return [4 /*yield*/, this.trelloClient.archiveCard(validArgs.cardId)];
                    case 12:
                        card = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
                            }];
                    case 13:
                        validArgs = (0, validators_js_1.validateMoveCardRequest)(args);
                        return [4 /*yield*/, this.trelloClient.moveCard(validArgs.cardId, validArgs.listId)];
                    case 14:
                        card = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(card, null, 2) }],
                            }];
                    case 15:
                        validArgs = (0, validators_js_1.validateAddListRequest)(args);
                        return [4 /*yield*/, this.trelloClient.addList(validArgs.name)];
                    case 16:
                        list = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
                            }];
                    case 17:
                        validArgs = (0, validators_js_1.validateArchiveListRequest)(args);
                        return [4 /*yield*/, this.trelloClient.archiveList(validArgs.listId)];
                    case 18:
                        list = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
                            }];
                    case 19: return [4 /*yield*/, this.trelloClient.getMyCards()];
                    case 20:
                        cards = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(cards, null, 2) }],
                            }];
                    case 21:
                        validArgs = (0, validators_js_1.validateAttachImageRequest)(args);
                        _b.label = 22;
                    case 22:
                        _b.trys.push([22, 24, , 25]);
                        return [4 /*yield*/, this.trelloClient.attachImageToCard(validArgs.cardId, validArgs.imageUrl, validArgs.name)];
                    case 23:
                        attachment = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(attachment, null, 2) }],
                            }];
                    case 24:
                        error_1 = _b.sent();
                        return [2 /*return*/, this.handleErrorResponse(error_1)];
                    case 25: return [4 /*yield*/, this.trelloClient.listBoards()];
                    case 26:
                        boards = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(boards, null, 2) }],
                            }];
                    case 27:
                        validArgs = (0, validators_js_1.validateSetActiveBoardRequest)(args);
                        _b.label = 28;
                    case 28:
                        _b.trys.push([28, 30, , 31]);
                        return [4 /*yield*/, this.trelloClient.setActiveBoard(validArgs.boardId)];
                    case 29:
                        board = _b.sent();
                        return [2 /*return*/, {
                                content: [{
                                        type: 'text',
                                        text: "Successfully set active board to \"".concat(board.name, "\" (").concat(board.id, ")")
                                    }],
                            }];
                    case 30:
                        error_2 = _b.sent();
                        return [2 /*return*/, this.handleErrorResponse(error_2)];
                    case 31: return [4 /*yield*/, this.trelloClient.listWorkspaces()];
                    case 32:
                        workspaces = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(workspaces, null, 2) }],
                            }];
                    case 33:
                        validArgs = (0, validators_js_1.validateSetActiveWorkspaceRequest)(args);
                        _b.label = 34;
                    case 34:
                        _b.trys.push([34, 36, , 37]);
                        return [4 /*yield*/, this.trelloClient.setActiveWorkspace(validArgs.workspaceId)];
                    case 35:
                        workspace = _b.sent();
                        return [2 /*return*/, {
                                content: [{
                                        type: 'text',
                                        text: "Successfully set active workspace to \"".concat(workspace.displayName, "\" (").concat(workspace.id, ")")
                                    }],
                            }];
                    case 36:
                        error_3 = _b.sent();
                        return [2 /*return*/, this.handleErrorResponse(error_3)];
                    case 37:
                        validArgs = (0, validators_js_1.validateListBoardsInWorkspaceRequest)(args);
                        _b.label = 38;
                    case 38:
                        _b.trys.push([38, 40, , 41]);
                        return [4 /*yield*/, this.trelloClient.listBoardsInWorkspace(validArgs.workspaceId)];
                    case 39:
                        boards = _b.sent();
                        return [2 /*return*/, {
                                content: [{ type: 'text', text: JSON.stringify(boards, null, 2) }],
                            }];
                    case 40:
                        error_4 = _b.sent();
                        return [2 /*return*/, this.handleErrorResponse(error_4)];
                    case 41:
                        _b.trys.push([41, 43, , 44]);
                        boardId = this.trelloClient.activeBoardId;
                        return [4 /*yield*/, this.trelloClient.getBoardById(boardId)];
                    case 42:
                        board = _b.sent();
                        return [2 /*return*/, {
                                content: [{
                                        type: 'text',
                                        text: JSON.stringify(__assign(__assign({}, board), { isActive: true, activeWorkspaceId: this.trelloClient.activeWorkspaceId || 'Not set' }), null, 2)
                                    }],
                            }];
                    case 43:
                        error_5 = _b.sent();
                        return [2 /*return*/, this.handleErrorResponse(error_5)];
                    case 44: throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, "Unknown tool: ".concat(request.params.name));
                    case 45: return [3 /*break*/, 47];
                    case 46:
                        error_6 = _b.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: error_6 instanceof Error ? error_6.message : 'Unknown error occurred',
                                    },
                                ],
                                isError: true,
                            }];
                    case 47: return [2 /*return*/];
                }
            });
        }); });
    };
    TrelloServer.prototype.handleErrorResponse = function (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: "Error: ".concat(error instanceof Error ? error.message : 'Unknown error occurred'),
                },
            ],
            isError: true,
        };
    };
    TrelloServer.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transport = new stdio_js_1.StdioServerTransport();
                        // Load configuration before starting the server
                        return [4 /*yield*/, this.trelloClient.loadConfig().catch(function (error) {
                                console.error('Failed to load saved configuration:', error);
                                // Continue with default config if loading fails
                            })];
                    case 1:
                        // Load configuration before starting the server
                        _a.sent();
                        return [4 /*yield*/, this.server.connect(transport)];
                    case 2:
                        _a.sent();
                        console.error('Trello MCP server running on stdio');
                        return [2 /*return*/];
                }
            });
        });
    };
    return TrelloServer;
}());
var server = new TrelloServer();
server.run().catch(console.error);
