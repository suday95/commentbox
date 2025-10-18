import React, { useEffect } from 'react'
import { useState } from 'react';
import Comments from '../components/Comments';
import { AuthCredential } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '../firebase';
import { useNavigate } from 'react-router-dom';
import {doc,getDoc} from 'firebase/firestore';

// async function getUserData() {
//   const user = auth.currentUser; // Logged-in user

//   if (!user) {
//     console.log("No user logged in");
//     return null;
//   }

//   // Fetch Firestore document using UID
//   const docRef = doc(db, "users", user.uid);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     const userData = docSnap.data();
//     console.log("User data from Firestore:", userData);
//     return userData;
//   } else {
//     console.log("No Firestore document found for this user");
//     return null;
//   }
// }



function AppHome() {
   const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      alert("You are not signed in");
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
      } else {
        console.log("No Firestore document found for this user");
      }
    }

    fetchUserData();
  }, [navigate]);

  if (!data) return <p>Loading user data...</p>;

    // useEffect(
    //     ()=>{ const unsubscribe = onAuthStateChanged(auth, (currentuser)=> {
    //         if(currentuser){
    //             setUser(currentuser);
    //             alert("user_detatils:", currentuser.name);
    //         }
    //         else{
    //             alert("you are not signed in,");
    //             navigate("/signin");
    //         }
    //     });
    //     return () => unsubscribe();
    //     },[]
    // );
    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-50 py-10 max-w-full animate-gradient">
                {/* Post Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Post Header */}
                    <div className="p-5 flex items-center gap-3">
                        <img
                            src={data.avatar || `https://api.dicebear.com/6.x/identicon/svg?seed=001`}
                            alt="User"
                            className="w-10 h-10 rounded-full border"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">{data.name}</h2>
                            <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                    </div>

                    {/* Post Image */}
                    <div className="w-full">
                        <img
                            src="./src/assets/img1.jpg"
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
                        <span className="text-gray-400">12 comments</span>
                    </div>
                </div>

                <div className={` container  overflow-y-auto mx-auto px-2 bg-red-100`}>
                    <Comments />
                </div>
            </div>
        </>
    );
}

export default AppHome