import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/userStore";
import { useProjectStore } from "../../stores/projectStore";
import styles from "./UserSearch.module.css";

function UserSearch({ currentProject }) {
    const { fetchUsersByName } = useUserStore();
    const { addToProject } = useProjectStore();
    const [username, setUsername] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async () => {
        try {
            const res = await fetchUsersByName(username.trim());
            setSearchResult(res.users);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(handleSearch, 500);
        return () => clearTimeout(timeout);
    }, [username]);

    const handleAddToProject = async (userId) => {
        if(!currentProject) return toast.error("You must select a project first");
        if(!userId) return toast.error("No user selected");
        try {
            await addToProject(currentProject._id, userId);
            toast.success("User added to project successfully");
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className={styles.userSearch}>
            <input 
                type="text"
                placeholder="Find someone?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {searchResult.length > 0 ? searchResult.map(user => (
                <div key={user._id}>
                    <span>{user.username}</span>
                    <button onClick={() => handleAddToProject(user._id)}>
                        Add
                    </button>
                </div>
            )) : (
                <div style={{ textAlign: "center" }} >No results</div>
            )}

        </div>
    )
}

export default UserSearch;