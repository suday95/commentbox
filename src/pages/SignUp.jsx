import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth,db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {doc, setDoc} from "firebase/firestore";
import { Toaster,toast} from 'react-hot-toast';





export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername]=useState("");
  const [avatar,setAvatar]=useState("");
  const navigate = useNavigate();

  const handlesignin =()=>{
    navigate("/signin")
  }

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
        await setDoc(doc(db,"users",user.uid),{
        name:username,
        email:user.email,
        avatar:avatar,
        createdAt:new Date(),
    });
    if(userCredential.user){
      toast.success("User created:", userCredential.user);
    navigate("/");
    }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="username"
          className="w-full p-3 mb-4 border rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="avatar url(optional)"
          className="w-full p-3 mb-4 border rounded-lg"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
        <button
        onClick={handlesignin}
        className="pt-1 pl-10 hover:text-blue-800 underline "
        >
            Already Have an account, Sign in here
        </button>
      </div>
    </div>
  );
}
