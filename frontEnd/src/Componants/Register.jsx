import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"


const Register = () => {
    const [username,setUserName]=useState("")
    const [password,setPassword]=useState("")
    const [firstname,setFirstName]=useState("")
    const [lastname,setLastName]=useState("")
    const [number,setNumber]=useState()
    const [company,setCompany]=useState("")
    const [errors, setErrors] = useState({})
    const navigation=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const userData = {
            username,
            firstname,
            lastname,
            password,
            number,
            company
        };

        try {
            const response = await axios.post('http://localhost:3000/admin/signup', userData);
            console.log(response.data);
            navigation("/dashboard");
        } catch (error) {
            console.log("Registration failed:", error.response.data);
            setErrors(error.response.data.errors || {});
            console.log(errors.username);
        }
    };
  return (
    <div className="flex flex-col items-start gap-14 bg-gray-100 box-border shadow-gray-300 shadow-lg
    border-[1px] border-gray-300 rounded-[5px] w-fit h-[300px]">
        <div className="w-full h-3 font-medium text-3xl py-3 text-center">
            <h1>Admin Registeration</h1>
        </div>
        <div className="bg-white w-full p-2 text-sm font-normal">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="username">userName<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="text" required name="username" id="username" value={username} onChange={(e) =>setUserName(e.target.value)}/>
                        {errors.username && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.username}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password">password<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="password" required value={password} onChange={(e) =>setPassword(e.target.value)}/>
                        {errors.password && <p className="text-red-500 text-sm w-[200px] break-words mt-1">{errors.password}</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="firstname">First Name<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="text"  required  id="firstname" value={firstname} onChange={(e) =>setFirstName(e.target.value)}/>
                        {errors.firstName && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="lastname">Last Name<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="text" required id="lastname" value={lastname} onChange={(e) =>setLastName(e.target.value)}/>
                        {errors.lastName && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.lastName}</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="phone">Phone<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="text" required id="phone" value={number} onChange={(e) =>setNumber(e.target.value)}/>
                        {errors.number && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.number}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="company">Company Name<span className="text-red-600">*</span></label>
                        <input className="border-[1px] border-gray-300 rounded-md" type="text"  required id="company" value={company} onChange={(e) =>setCompany(e.target.value)}/>
                        {errors.company && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.company}</p>}
                    </div>
                </div>
                <div className="flex justify-evenly gap-4 items-center py-3">
                    <input className="text-white bg-blue-700 cursor-pointer py-2 px-3 rounded-md" type="submit" value="Submit"/>
                    <input className="text-white bg-red-700 cursor-pointer py-2 px-3 rounded-md" type="reset" value="Delete"/>
                </div>
            </form>
        </div>
    </div>
)
}

export default Register