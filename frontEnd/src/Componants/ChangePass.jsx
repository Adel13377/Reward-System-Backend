import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";

const ChangePassword = () => {
    const [password, setPassword] = useState("");
    const [oldpass, setOldpass] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        // Check if passwordChangeRequired is true
        const passwordChangeRequired = localStorage.getItem("passwordChangeRequired");
        if (passwordChangeRequired === "true") {
            setOldpass("P@ssw0rd2024"); // Set default old password
        }
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {

            const response = await axios.patch(
                "/admin/change-password",
                { oldpass, password },
            );

            toast.success(response.data.message);

            localStorage.removeItem("passwordChangeRequired");
            navigate("/");
        } catch (error) {
            console.error("Password change failed:", error.response ? error.response.data : error.message);
            setErrors(error.response.data.errors || {});
            toast.error("Failed to change password.");
        }
    };

    return (
        <div className="min-h-screen bg-primaryColor flex justify-center items-center gap-2 flex-col pb-4">
            <div className="mx-auto py-6 text-textColor flex items-center justify-center flex-col">
            <div className="w-[70%] flex items-center justify-center pr-20">
            <img
                src="/rewardhup-high-resolution-logo-transparent.png"
                alt="logo"
                className="w-[100%]"
            />
            </div>
            <div className="flex flex-col items-start gap-14 text-TextColor rounded-[5px] w-[300px] h-[300px]">
            <div className="w-full h-3 font-medium text-3xl py-1text-center">
        <div className="change-password-container">
            <h2>Change Your Password</h2>
            <form onSubmit={handleChangePassword}>
            {!localStorage.getItem("passwordChangeRequired") && (
                    <div className="flex flex-col">
                        <label htmlFor="oldpass" className="block text-TextColor mb-2">Old Password</label>
                        <input
                            className="border-[1px] border-gray-300 rounded-md text-textInput py-[3px] px-[5px]"
                            type="password"
                            value={oldpass}
                            onChange={(e) => setOldpass(e.target.value)}
                            required
                        />
                    </div>
                )}
    
                    <div className="flex flex-col">
                            <label htmlFor="username" className="block text-TextColor mb-2">New Password </label>
                            <input className="border-[1px] border-gray-300 rounded-md text-textInput py-[3px] px-[5px]" type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        required
                        />
                    </div>
                
                
                    
                    <div className="flex flex-col">
                            <label htmlFor="username" className="block text-TextColor mb-2">Confirm Password </label>
                            <input className="border-[1px] border-gray-300 rounded-md text-textInput py-[3px] px-[5px]" 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                                />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.password}</p>}
                    <div className="flex justify-evenly gap-4 items-center py-3">
                        <input className="w-full bg-btnColor hover:bg-btnColorHover text-white py-2 px-4 rounded duration-75" type="submit" value="Change password" />
                    </div>
                
            </form>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default ChangePassword;