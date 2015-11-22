function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    console.log.apply(args);
}
exports.log = log;
function createDocMessage(message, doc) {
    return message;
}
exports.createDocMessage = createDocMessage;
//# sourceMappingURL=log.js.map