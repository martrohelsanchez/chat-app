import React, { useContext, useEffect } from 'react';
import {useHistory} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane/messagesPane';
import {UserInfoContext, socket} from '../../App';

import { useDispatch, useSelector } from 'react-redux';
import {addNewMsg, updateLastSeen, deleteConv} from '../../redux/actions/conversationsActions';

function Chat() {
    const currConvId = useSelector(state => state.currConv._id);
    const currConv = useSelector((state => state.conversations.find(conv => conv._id === state.currConv._id))) || {};
    const state = useSelector(state => state);
    const userInfo = useContext(UserInfoContext);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('sendMsg', newMsg => {
            //dispatch if the newMsg is for the current conversation
            console.log('received a message')
            if (currConvId === newMsg.conversation_id) {
                dispatch(addNewMsg(currConvId, newMsg));
            }
        });

        // socket.on('seen', (convId, seenMeta) => {
        //     dispatch(updateLastSeen(convId, seenMeta));
        // });
    }, []);

    useEffect(() => {
        if (currConvId) {
            socket.emit('join room', currConvId);
        }

        return () => {
            socket.emit('leave room', currConvId);
        }
    }, [currConvId])

    useEffect(() => {
        return () => {
            if (currConv.convHasCreated === false) {
                console.log('deleted: ', currConvId);
                dispatch(deleteConv(currConvId));
            }
        }
    }, [currConvId]);

    if (!userInfo) {
        history.push('/logIn');
        //returning null to prevent returning the ContactsPane and MessagePane components
        return null;
    }

    return (
        <>
            <ContactsPane />
            <MessagePane />
        </>
    )
}

export default Chat;