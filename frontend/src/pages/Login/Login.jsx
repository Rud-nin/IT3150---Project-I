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
                const res = await login(username, password);
                if(!res.success) throw new Error(res.message);
                toast.success('Login successful');
                navigate('/dashboard');
            } else {
                const res = await register(username, password);
                if(!res.success) throw new Error(res.message);
                toast.success('Registration successful');
                setAction('login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

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