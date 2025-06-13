"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateString = validateString;
exports.validateOptionalString = validateOptionalString;
exports.validateNumber = validateNumber;
exports.validateOptionalNumber = validateOptionalNumber;
exports.validateStringArray = validateStringArray;
exports.validateOptionalStringArray = validateOptionalStringArray;
exports.validateGetCardsListRequest = validateGetCardsListRequest;
exports.validateGetRecentActivityRequest = validateGetRecentActivityRequest;
exports.validateAddCardRequest = validateAddCardRequest;
exports.validateUpdateCardRequest = validateUpdateCardRequest;
exports.validateArchiveCardRequest = validateArchiveCardRequest;
exports.validateAddListRequest = validateAddListRequest;
exports.validateArchiveListRequest = validateArchiveListRequest;
exports.validateMoveCardRequest = validateMoveCardRequest;
exports.validateAttachImageRequest = validateAttachImageRequest;
exports.validateSetActiveBoardRequest = validateSetActiveBoardRequest;
exports.validateSetActiveWorkspaceRequest = validateSetActiveWorkspaceRequest;
exports.validateListBoardsInWorkspaceRequest = validateListBoardsInWorkspaceRequest;
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
function validateString(value, field) {
    if (typeof value !== 'string') {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "".concat(field, " must be a string"));
    }
    return value;
}
function validateOptionalString(value) {
    if (value === undefined)
        return undefined;
    return validateString(value, 'value');
}
function validateNumber(value, field) {
    if (typeof value !== 'number') {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "".concat(field, " must be a number"));
    }
    return value;
}
function validateOptionalNumber(value) {
    if (value === undefined)
        return undefined;
    return validateNumber(value, 'value');
}
function validateStringArray(value) {
    if (!Array.isArray(value) || !value.every(function (item) { return typeof item === 'string'; })) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'Value must be an array of strings');
    }
    return value;
}
function validateOptionalStringArray(value) {
    if (value === undefined)
        return undefined;
    return validateStringArray(value);
}
function validateGetCardsListRequest(args) {
    if (!args.listId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'listId is required');
    }
    return {
        listId: validateString(args.listId, 'listId'),
    };
}
function validateGetRecentActivityRequest(args) {
    return {
        limit: validateOptionalNumber(args.limit),
    };
}
function validateAddCardRequest(args) {
    if (!args.listId || !args.name) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'listId and name are required');
    }
    return {
        listId: validateString(args.listId, 'listId'),
        name: validateString(args.name, 'name'),
        description: validateOptionalString(args.description),
        dueDate: validateOptionalString(args.dueDate),
        labels: validateOptionalStringArray(args.labels),
    };
}
function validateUpdateCardRequest(args) {
    if (!args.cardId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'cardId is required');
    }
    return {
        cardId: validateString(args.cardId, 'cardId'),
        name: validateOptionalString(args.name),
        description: validateOptionalString(args.description),
        dueDate: validateOptionalString(args.dueDate),
        labels: validateOptionalStringArray(args.labels),
    };
}
function validateArchiveCardRequest(args) {
    if (!args.cardId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'cardId is required');
    }
    return {
        cardId: validateString(args.cardId, 'cardId'),
    };
}
function validateAddListRequest(args) {
    if (!args.name) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'name is required');
    }
    return {
        name: validateString(args.name, 'name'),
    };
}
function validateArchiveListRequest(args) {
    if (!args.listId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'listId is required');
    }
    return {
        listId: validateString(args.listId, 'listId'),
    };
}
function validateMoveCardRequest(args) {
    if (!args.cardId || !args.listId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'cardId and listId are required');
    }
    return {
        cardId: validateString(args.cardId, 'cardId'),
        listId: validateString(args.listId, 'listId'),
    };
}
function validateAttachImageRequest(args) {
    if (!args.cardId || !args.imageUrl) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'cardId and imageUrl are required');
    }
    // Validate image URL format
    var imageUrl = validateString(args.imageUrl, 'imageUrl');
    try {
        new URL(imageUrl);
    }
    catch (e) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'imageUrl must be a valid URL');
    }
    return {
        cardId: validateString(args.cardId, 'cardId'),
        imageUrl: imageUrl,
        name: validateOptionalString(args.name),
    };
}
function validateSetActiveBoardRequest(args) {
    if (!args.boardId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'boardId is required');
    }
    return {
        boardId: validateString(args.boardId, 'boardId'),
    };
}
function validateSetActiveWorkspaceRequest(args) {
    if (!args.workspaceId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'workspaceId is required');
    }
    return {
        workspaceId: validateString(args.workspaceId, 'workspaceId'),
    };
}
function validateListBoardsInWorkspaceRequest(args) {
    if (!args.workspaceId) {
        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'workspaceId is required');
    }
    return {
        workspaceId: validateString(args.workspaceId, 'workspaceId'),
    };
}
