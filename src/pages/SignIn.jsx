import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster,toast} from 'react-hot-toast';


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlesignup =()=>{
    navigate("/signup")
  }
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if(userCredential.user){
      toast.success("Signed in:", userCredential.user);
        navigate("/");
    }
    else{
        toast.error("sign in failed, retry...")
    }

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sign In
        </button>
        <button
        onClick={handlesignup}
        className="pt-1 hover:text-blue-800 underline"
        >
            Don't Have an account, Don't worry create here
        </button>
      </div>
      
    </div>
  );
}
