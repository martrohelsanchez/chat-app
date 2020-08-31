import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import styles from './logIn.module.css';
import {socket} from '../../App';
import Loading from '../loading/Loading';

import { useDispatch } from 'react-redux';
import {setUserInfo} from '../../redux/actions/userInfoActions';
import { logInReq } from '../../api/APIUtils';

function LogIn() {
    const [input, setInput] = useState('');
    const [err, setErr] = useState(null);
    const usernameInputRef = useRef(); 
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
       usernameInputRef.current.focus(); 
    });

    async function handleLogIn(usernameInput) {
        try {
            const data = await logInReq(usernameInput);
            const {csrfToken, _id, username, isAuth} = data

            if (isAuth) {
                setInput('');

                dispatch(setUserInfo({
                    userId: _id,
                    username
                }));

                window.localStorage.setItem('csrfToken', csrfToken);

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
        <div className={styles.logInContainer}>
            <h3 className={styles.promptNickname}>Log In</h3>
            <h3 className={styles.promptNickname}>Enter your nickname?</h3>
            <input 
                className={styles.nicknameInput} 
                ref={usernameInputRef}
                type="input"
                value={input}
                autoFocus
                onChange={onInputChange}
                onKeyDown={({ key }) => key === 'Enter' ? handleLogIn(input) : null}
            />
            <div className={styles.err}>{err}</div>
            <div>
                {isLoading && <Loading />}
            </div>
            <button className={styles.logInBtn} onClick={handleLogIn}>
                Log In
            </button>
            <br />
            <p style={{textAlign: 'center'}}>
                Doesn't have an account yet?
            </p>
            <button className={styles.signUpBtn} onClick={directToSignUp}>
                Sign Up
            </button>
        </div>
    )
}

export default LogIn