const handleDelete = async (username, username2, method) => {
    try {
        await method(username, username2);
        window.location.reload();
    } catch (error) {
        console.error("Error deleting:", error);
    }
};

export default { handleDelete };