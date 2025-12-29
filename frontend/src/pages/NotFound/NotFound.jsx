import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
    const navigate = useNavigate();
    const [time, setTime] = useState(0);

    const secondsToHMS = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) return "00:00:00";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return [
            h.toString().padStart(2, "0"),
            m.toString().padStart(2, "0"),
            s.toString().padStart(2, "0")
        ].join(":");
    }

    const formattedTime = secondsToHMS(time);

    useEffect(() => {
        const interval = setInterval(
            () => setTime(prevTime => prevTime + 1),
            1000
        );
        return () => clearInterval(interval);
    }, [])

    return (
        <div className={styles.notFound}>
            <div>
                <h2>No task your you here</h2>
                <div className={styles.divider} />
                <p>
                    Nothing for you to looking here<br/>
                    But you can stay here as long as you want.
                </p>
                <div>Time passed: {formattedTime}</div>
                <div className={styles.divider} />
                <form onSubmit={() => navigate("/login")}>
                    <button>Login</button>
                </form>
            </div>
        </div>
    )
}
export default NotFound;