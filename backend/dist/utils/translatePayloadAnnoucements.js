"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrasePayloadArray = PrasePayloadArray;
function PrasePayloadArray(states) {
    let selectedStates = [];
    if (typeof states === 'string') {
        try {
            const parsed = JSON.parse(states);
            selectedStates = Array.isArray(parsed) ? parsed : [states];
        }
        catch (_a) {
            selectedStates = [states];
        }
    }
    else if (Array.isArray(states)) {
        selectedStates = states;
    }
    return selectedStates;
}
