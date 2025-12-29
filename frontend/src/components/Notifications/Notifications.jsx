import { useEffect } from "react";
import { useNotificationStore } from "../../stores/notificationStore";
import toast from "react-hot-toast";
import styles from "./Notifications.module.css";

function Notifications() {
    const { notifications, fetchNotifications, deleteNotification } = useNotificationStore();

    const handleDeleteNotification = (id) => deleteNotification(id)
        .then(() => toast.success("Notification deleted successfully"))
        .catch(() => toast.error("Failed to delete your notification"));
    
    useEffect(() => {
        fetchNotifications()
            .catch(() => toast.error("Failed to fetch your notifications"));
    }, [])

    return (
        notifications.length > 0 ? (
            <div className={styles.notifications}>
                {notifications.map(notification => (
                    <div key={notification._id}>
                        {notification.message}
                        <button onClick={() => handleDeleteNotification(notification._id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div>No notifications</div>
        )
    )
}

export default Notifications;