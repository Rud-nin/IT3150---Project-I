import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import styles from './Login.module.css';

function Login() {
    const [action, setAction] = useState('login'); // login | register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, checkAuth, isValidUser, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === 'login') {
                await login(username, password);
                toast.success('Login successful');
                navigate('/dashboard');
            } else {
                await register(username, password);
                toast.success('Registration successful');
                setAction('login');
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    if(!isLoading && isValidUser)
        return <Navigate to="/dashboard" replace={true} />

    return (
        <main className={styles.login}>
            <div>
                <div>
                    <h2>{action === 'login' ? 'Welcome Back!' : 'Create new Account!'}</h2>
                    <span className={styles.switch}>
                        <button onClick={() => setAction('register')}>Register</button>
                        <button onClick={() => setAction('login')}>Login</button>
                    </span>
                </div>
                <div className={styles.divider}></div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div>
                    <input
                        placeholder="Enter Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div>
                    <input
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit">Continue</button>
                </form>
            </div>
        </main>
    )
}

export default Login;