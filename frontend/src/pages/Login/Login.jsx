import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import styles from './Login.module.css';

function Login() {
    const [action, setAction] = useState('login'); // login | register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const register = useAuthStore((state) => state.register);
    const login = useAuthStore((state) => state.login);
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
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <main className={styles.login}>
            <div>
                <h1>{action === 'login' ? 'Welcome Back!' : 'Create new Account!'}</h1>
                <div className={styles.switch}>
                    <button onClick={() => setAction('register')}>Register</button>
                    <button onClick={() => setAction('login')}>Login</button>
                </div>
                <div className={styles.divider}></div>
                <form onSubmit={handleSubmit}>
                    <div className={`${styles.username} ${styles.field}`}>
                    <input
                        className={styles.username}
                        placeholder=""
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                    <label>Username</label>
                    </div>

                    <div className={`${styles.password} ${styles.field}`}>
                    <input
                        className={styles.password}
                        placeholder=""
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <label>Password</label>
                    </div>

                    <button type="submit">
                        {action === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default Login;