import { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"; 
import { toast } from "react-toastify";

const Register = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate()
    const proceedLogin = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('http://localhost:3000/admin/login', {
                    username: userName,
                    password: password,
                    role: 'admin'
                });
                const { accessToken, refreshToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                console.log("Login Done", accessToken);
                toast("Login successful!");
                navigate("dashboard")
            } catch (error) {
                console.error("Login failed:", error.response ? error.response.data : error.message);
                toast("Invalid username or password");
            }
        }
    };

    const validate = () => {
        let result = true;
        if (userName === "" || userName === null) {
            result = false;
            toast("Please enter UserName");
        }
        if (password === "" || password === null) {
            result = false;
            toast("Please enter Password");
        }
        return result;
    };

    return (
        <div className="flex flex-col items-start gap-14 bg-gray-100 box-border shadow-gray-300 shadow-lg
        border-[1px] border-gray-300 rounded-[5px] w-[300px] h-[300px]">
            <div className="w-full h-3 font-medium text-3xl py-3 text-center">
                <h1>Admin Login</h1>
            </div>
            <div className="bg-white w-full p-2 text-sm font-normal h-[210px]">
                <form onSubmit={proceedLogin}>
                    <div className="flex gap-2 flex-col ">
                        <div className="flex flex-col">
                            <label htmlFor="username">UserName </label>
                            <input className="border-[1px] border-gray-300 rounded-md  py-[3px] px-[5px]" type="text" value={userName} id="username" onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password">Password</label>
                            <input className="border-[1px] border-gray-300 rounded-md py-[3px] px-[5px]" type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-evenly gap-4 items-center py-3">
                        <input className="text-white bg-blue-700 cursor-pointer py-2 px-3 rounded-md" type="submit" value="Login" />
                        <a href="register" className="text-white bg-green-700 cursor-pointer py-2 px-3 rounded-md">Resgister</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
