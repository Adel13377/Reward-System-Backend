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
                const { accessToken, refreshToken, passwordChangeRequired } = response.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("passwordChangeRequired", passwordChangeRequired);
                console.log("Login Done", accessToken);
                toast("Login successful!");
                if (passwordChangeRequired) {
                    navigate("/change-password");
                } else {
                    navigate("/")
                }
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
        <div className="bg-primaryColor flex justify-center h-full w-full items-center gap-2 flex-col pb-4">
            <div className="w-[70%] flex items-center justify-center pr-20">
            <img
                src="/rewardhub-high-resolution-logo__2_-removebg-preview-2.png"
                alt="logo"
                className="w-[100%]"
            />
            </div>
            <div className="flex flex-col items-start gap-14 text-TextColor rounded-[5px] w-[300px] h-[300px]">
            <div className="w-full h-3 font-medium text-3xl py-1text-center">
                <h1 className="text-3xl ">Admin Login</h1>
            </div>
            <div className=" w-full p-2 text-lg  h-[210px]">
                <form onSubmit={proceedLogin}>
                    <div className="flex gap-2 flex-col ">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="block text-TextColor mb-2">UserName </label>
                            <input className="border-[1px] border-gray-300 rounded-md text-textInput py-[3px] px-[5px]" type="text" value={userName} id="username" onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="block text-TextColor mb-2">Password</label>
                            <input className="border-[1px] border-gray-300 rounded-md text-textInput  py-[3px] px-[5px]" type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-evenly gap-4 items-center py-3">
                        <input className="w-full bg-btnColor hover:bg-btnColorHover text-white py-2 px-4 rounded duration-75" type="submit" value="Login" />
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Register;
