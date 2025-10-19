import React, { useEffect } from 'react'
import { useState } from 'react';
import Comments from '../components/Comments';
import { AuthCredential } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '../firebase';
import { useNavigate } from 'react-router-dom';
import {doc,getDoc} from 'firebase/firestore';
import { Toaster,toast} from 'react-hot-toast';
import {ClockLoader} from 'react-spinners'

import { signOut } from "firebase/auth";


function AppHome() {
   const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("You are not signed in");
      navigate("/signin");
      return; // stop further execution
    }

    // Fetch Firestore data for logged-in user
    async function fetchUserData() {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        console.log("User Name:", docSnap.data().name);
        toast.success(`Welcome to comment box ${docSnap.data().name}`);
      } else {
        console.log("No Firestore document found for this user");
      }
    }

    fetchUserData();
  }, [navigate]);
  const [data_, setData_] = useState([]);
  if (!data) return <p className='flex justify-center items-center h-screen'><ClockLoader color={"#ffa600"}/></p>;
   const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      // Optionally redirect to signin page
        navigate("/signin");
    } catch (error) {
      toast.error("Logout error:", error);
    }
  };

    return (
        <>
                <Toaster position="top-right" reverseOrder={false} />
            <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-50 py-10 max-w-full animate-gradient">
                
                {/* Post Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Post Header */}
                    <div className="p-5 flex items-center gap-3">

                        <img
                            src={data.avatar || `https://api.dicebear.com/6.x/identicon/svg?seed=002`}
                            alt="User"
                            className="w-10 h-10 rounded-full border"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">{data.name}</h2>
                            <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                        <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 justify-right text-white rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
                    </div>

                    {/* Post Image */}
                    <div className="w-full">
                        <img
                            src="https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
                            alt="Post"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Caption */}
                    <div className="p-5 text-gray-700">
                        <p className="text-lg leading-relaxed">
                            A glimpse into my latest design — feedback and thoughts are welcome 👇
                        </p>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="px-5 pb-4 flex justify-between items-center text-gray-500 text-sm">
                        <div className="flex items-center gap-5">
                            <button className="flex items-center gap-1 hover:text-blue-500 transition">
                                👍 <span>Upvote</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-pink-500 transition">
                                ❤️ <span>Like</span>
                            </button>
                        </div>
                        <span className="text-gray-400">{data_.length} comments</span>
                    </div>
                </div>

                <div className={` container  overflow-y-auto mx-auto rounded-md px-2 bg-red-100`}>
                    <Comments setData_={setData_} />
                </div>
            </div>
        </>
    );
}

export default AppHome