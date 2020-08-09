export function retrieveConversations(retrieveConv) {
    return {
        type: 'conversations/retrievedConversations',
        payload: {
            retrieveConv
        }
    }
}

export function addPrevMsgs(convId, prevMsgs) {
    return {
        type: 'conversations/addedPreviousMessages',
        payload: {
            prevMsgs,
            convId
        }
    }
}

export function addNewMsg(convId, newMsg) {
    return {
        type: 'conversations/addedANewMessage',
        payload: {
            newMsg: newMsg,
            convId
        }
    }
}

export function updateLastSeen(seenMeta, convId) {
    return {
        type: 'conversation/updatedLastSeen', 
        payload: {
            seenMeta,
            convId
        }
    }
}

export function updateDelivered(deliveredMeta, convId) {
    return {
        type: 'conversations/updatedDelivered',
        payload: {
            deliveredMeta,
            convId
        }
    }
}

export function msgSent(msgId, convId, newDateSent, newMsgId) {
    return {
        type: 'conversations/msgWasSent',
        payload: {
            msgId,
            convId,
            newDateSent,
            newMsgId
        }
    }
}