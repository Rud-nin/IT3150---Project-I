import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import { useNotificationStore } from '../../stores/notificationStore';
import styles from './Loading.module.css';

function Loading() {
    const authLoading = useAuthStore((state) => state.isLoading);
    const userLoading = useUserStore((state) => state.isLoading);
    const projectLoading = useProjectStore((state) => state.isLoading);
    const taskLoading = useTaskStore((state) => state.isLoading);
    const notificationLoading = useNotificationStore((state) => state.isLoading);

    const isLoading =
        authLoading ||
        userLoading ||
        projectLoading ||
        taskLoading ||
        notificationLoading;

    return (
        <div className={`${styles.loading} ${isLoading ? styles.show : styles.hide}`}>
            <i className="fa-solid fa-arrows-rotate"></i>
        </div>
    )
}

export default Loading;