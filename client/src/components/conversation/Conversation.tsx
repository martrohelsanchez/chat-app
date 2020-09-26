import React from 'react';
import styled from 'styled-components';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {LastSeen, MergedConversation} from 'shared/types/dbSchema';

import {rootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {UserInfo} from 'redux/actions/userInfoActions';

interface ConversationProps {
    conv: MergedConversation;
    userLastSeenDoc: LastSeen | null;
}

function Conversation({conv, userLastSeenDoc}: ConversationProps) {               
    const user = useSelector((state: rootState ) => state.userInfo as UserInfo)
    const history = useHistory();
    const match = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConvId = match ? match.params.convId : '';
    const {last_message, is_group_chat, group_name, members_username} = conv;
    let conversationName;

    if (is_group_chat) {
        conversationName = group_name;
    } else {
        conversationName = members_username.find(username => username !== user.username);
    }

    function handleOpenConvo() {
        history.push(`/chat/${conv._id}`);
    }

    const isRead = knowIfHasRead(userLastSeenDoc, conv, user.userId);
    const isSelected = currConvId === conv._id ? true : false;
 
    return (
        <StyledConversation isRead={isRead} isSelected={isSelected} onClick={handleOpenConvo}>
            <ProfilePicHolder></ProfilePicHolder>
            <div>
                <ConvName>
                    {conversationName}
                </ConvName>
                <LastConvoPrev>
                    <span>
                        {last_message.sender_username}:{' '}
                    </span>
                    <span>
                        {last_message.message_body}
                    </span>
                </LastConvoPrev>
            </div>
        </StyledConversation>
    ) 
}

function knowIfHasRead(
    lastReadDoc: ConversationProps['userLastSeenDoc'], 
    conv: MergedConversation,
    userId: string
) {
    if (lastReadDoc === null) {
        return true
    }

    //If members_meta is not populated
    if (typeof conv.members_meta === 'string') {
        //Use LastMessage document
        return lastReadDoc.last_seen[conv._id] >= conv.last_message.date_sent
    }

    return (conv.members_meta.find(member => member.user_id === userId)?.last_seen as number) >= conv.last_message.date_sent;
}


const StyledConversation = styled.div<{isRead: boolean, isSelected: boolean}>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: .5rem;
    background-color: ${({isSelected, theme}) => isSelected ? theme.dark.thirdly : 'transparent'};
    color: ${({isSelected, theme}) => isSelected ? theme.text.secondary : 'white'};
    font-weight: ${({isRead}) => isRead ? null : '600'};

    &:hover {
        cursor: pointer;
        background-color: ${({isSelected, theme}) => isSelected ? null : theme.dark.secondary};
    }
`;

const ConvName = styled.p`
    font-weight: bold;
    font-size: 1.1rem;
`

const LastConvoPrev = styled.div`
    font-size: 1rem;
`;

const ProfilePicHolder = styled.div`
    height: 50px;
    width: 50px;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    margin-right: 10px;
`;

export default Conversation