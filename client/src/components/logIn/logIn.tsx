import React, {useState, useEffect, useRef} from 'react';
import {useHistory, Link} from 'react-router-dom';

import Loading from 'components/loading/Loading';
import {logInReq, UserAuthRes} from 'api/APIUtils';
import * as S from './Login.styles';
import next from 'images/next.svg'

import {useDispatch} from 'react-redux';
import {setUserInfo} from 'redux/actions/userInfoActions';

const LogIn = () => {
    const [input, setInput] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null); 
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        usernameInputRef.current?.focus()
    }, []);

    async function handleLogIn (usernameInput: string) {
        try {
            const data = await logInReq(usernameInput.trim());
            const {csrfToken, userId, username, isAuth} = data as UserAuthRes;

            if (isAuth) {
                window.localStorage.setItem('csrfToken', csrfToken);

                setInput('');
                dispatch(setUserInfo({
                    userId: userId,
                    username
                }));

                history.push('/chat');
            } // if isAuth is false, server send 401 status
        } catch (err) {
            if (!err.response) {
                    console.error(err)
                    return null
                }
            const {status} = err.response;
            
            if (status === 401) {
                setErr('Wrong nickname or password');
            } else {
                setErr('Sorry, something went wrong. Please try again later')   
            }
        }
    }

    function onInputChange(e) {
        setInput(e.target.value);
    }

    function directToSignUp() {
        history.push('/signUp')
    }

    return (
        <S.LogIn>
            <S.ChittyName>
                Chitty
            </S.ChittyName>
            <S.Wrapper>
                <S.ChittyMascot />
                <S.Err>
                    {err}
                </S.Err>
                <S.Input 
                    id='nickname-input'
                    data-testid='usernameInput'
                    ref={usernameInputRef}
                    placeholder='Username'
                    type="text"
                    value={usernameInput}
                    autoFocus
                    onChange={handleUsernameChange}
                    onKeyDown={({key}) => key === 'Enter' ? passInputRef.current.focus() : null}
                />
                <S.Input
                    type='password'
                    ref={passInputRef}
                    value={passInput}
                    onChange={handlePasswordChange} 
                    placeholder='Password'
                    onKeyDown={({key}) => key === 'Enter' ? handleLogIn() : null}
                />
                <div>
                    {isLoading && <Loading />}
                </div>
                <S.Register to='/signUp'>
                    Register
                </S.Register>
                <div style={{textAlign: 'center'}}>
                    <S.LogInBtn src={next} data-testid='logInBtn' onClick={handleLogIn}></S.LogInBtn>
                </div>
            </S.Wrapper>
        </S.LogIn>
    )
}

export default LogIn