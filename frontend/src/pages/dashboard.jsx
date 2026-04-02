import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const confirmLogout = window.confirm("Are you sure you want to logout of VaultPay?");

            if (!confirmLogout) return;

            const res = await fetch("http://localhost:3000/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (res.ok) {
                navigate("/");
            }
            
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return(
        <div>
            Hello there!
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard;