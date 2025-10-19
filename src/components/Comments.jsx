import { useMemo, Children, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

import Comment from './Comment';
import data from '../assets/data.json'
import { collection,doc,onSnapshot, updateDoc, addDoc, increment } from "firebase/firestore";
import users from "../assets/users.json";

import { Toaster,toast} from 'react-hot-toast';
for (let i = 0; i < data.length; i++) {
  data[i].likes = 1;
  data[i].liked = false;
  data[i].upvoted = false;
  data[i].user_name = "suday";
  data[i].clicked = false;

}

import { db } from "../firebase";
import { getDocs, query, where, orderBy } from "firebase/firestore";


async function updateCommentLikesByUser(userId) {
  const commentsRef = collection(db, "comments");

  // Query comment(s) with this user_id
  const q = query(commentsRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No comment found for user:", userId);
    return;
  }

  // Loop through all matched comments (in case user has multiple)
  querySnapshot.forEach(async (docSnap) => {
    const commentRef = doc(db, "comments", docSnap.id);

    // Example: increment likes

    await updateDoc(commentRef, {
      likes: increment(1),
      liked:true,
    });

    console.log(`Updated likes for comment ${docSnap.id} by user ${userId}`);
  });
}




async function updateCommentUpvotesByUser(userId) {
  const commentsRef = collection(db, "comments");

  // Query comment(s) with this user_id
  const q = query(commentsRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No comment found for user:", userId);
    return;
  }

  // Loop through all matched comments (in case user has multiple)
  querySnapshot.forEach(async (docSnap) => {
    const commentRef = doc(db, "comments", docSnap.id);

    // Example: increment likes

    await updateDoc(commentRef, {
      upvotes: increment(1),
      upvoted:true,
    });

    console.log(`Updated likes for comment ${docSnap.id} by user ${userId}`);
  });
}

async function getCommentDataById(idValue){
  const usersRef = collection(db, "users"); // your collection
  const q = query(usersRef, where("user_id", "==", idValue)); // query where field 'id' equals idValue

  const querySnapshot = await getDocs(q);

  // console.log("User data:", idValue);
  if (!querySnapshot.empty) {
    // Usually, you might get only one document
    const docSnap = querySnapshot.docs[0];
    return docSnap.data();
  } else {
    console.log("No comment found with id:", idValue);
    return null;
  }
}



async function getUserDataById(idValue) {
  const usersRef = collection(db, "users"); // your collection
  const q = query(usersRef, where("id", "==", idValue)); // query where field 'id' equals idValue

  const querySnapshot = await getDocs(q);

  // console.log("User data:", idValue);
  if (!querySnapshot.empty) {
    // Usually, you might get only one document
    const docSnap = querySnapshot.docs[0];
    return docSnap.data();
  } else {
    console.log("No user found with id:", idValue);
    return null;
  }
}




// async function uploadComments(users) {
//   if (!users || users.length === 0) {
//     console.error("⚠️ No users found to upload.");
//     return;
//   }

//   const usersCollection = collection(db, "comments");

//   try {
//     await Promise.all(
//       users.map(async (user) => {
//         if (!user.user_id) {
//           console.warn("⚠️ Skipping user without id:", user);
//           return;
//         }

//         // 🔍 Check if a user with the same ID already exists
//         const q = query(usersCollection, where("id", "==", user.user_id));
//         const existingDocs = await getDocs(q);

//         if (!existingDocs.empty) {
//           console.log(`⏭️ User already exists: ${user.id} (${user.user_id})`);
//           return; // skip adding duplicate
//         }

//         // ✅ Add if not found
//         await addDoc(usersCollection, {
//           ...user,
//           created_at: user.created_at || new Date().toISOString(),
//         });

//         console.log(`✅ Added user: ${user.id}`);
//       })
//     );

//     console.log("🚀 Upload complete!");
//   } catch (error) {
//     console.error("❌ Error uploading users:", error);
//   }
// }
// async function exportComments() {
//   const commentsRef = collection(db, "comments");
//   const snapshot = await getDocs(commentsRef);

//   const comments = snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   console.log("✅ Exported comments:", comments);

//   return comments;
// }

export function exportComments(setComments) {
  const commentsRef = collection(db, "comments");

  // Live listener
  const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("📡 Live comments update:", comments);
    setComments(comments); // update your state in real time
  });

  //return unsubscribe; // so you can stop listening if needed
}



function buildTree(data) {
  const map = new Map();
  const roots = [];
  data.forEach(element => {
    map.set(element.id, { ...element, children: [] });
  });
  // linking childrenb to parent
  data.forEach(item => {
    const node = map.get(item.id);
    if (item.parent_id === null) {
      roots.push(node);
    }
    else {
      const parent = map.get(item.parent_id);// object from the map
      if (parent) parent.children.push(node);
    }
  });
  return roots;
}

/*first tho get the data json"
then build a tree "individual trees 
will be constructed for every node with 
parent_id =null, then other than this will be connected to the parent_node it was 
pointed to.
*/



function Comments({setData_}) {
  const boxRef = useRef(null);
  const [boxheight, setBoxheight] = useState(0);
   const [data_, setData] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const comments = await exportComments(setData);
      console.log("Fetched comments:", comments);
    }

    fetchComments();
  }, []); 
  //console.log(data_tree[0]);
  useEffect(() => {
    const calcandsetheight = () => {
      if (boxRef.current) {
        const topposition = boxRef.current.getBoundingClientRect().top;
        const remheight = window.innerHeight - topposition;
        setBoxheight(remheight);
      }
    };

    calcandsetheight();
    window.addEventListener('resize', calcandsetheight);
    return () => {
      window.removeEventListener('resize', calcandsetheight);
    }

  }, [])

  // let [data_, setData_] = useState(data);
  const data_tree = useMemo(() => buildTree(data_), [data_]);
  setData_(data_);
  let [likes, setLikes] = useState(
    Object.fromEntries(data_.map(item => [item.id, item.likes]))
  );
  const onLike = (id) => {
    setLikes(
      prev => {
        const newLikes = {
          ...prev,
          [id]: (prev[id] || 0) + 1
        };
        // if(data[id-1]["liked"] == false){   
        //   // console.log(newLikes[id]);
        //   data[id-1]["likes"] = newLikes[id];
        // } 
        //   data[id-1]["liked"] = true;
        //   // console.log(data[id-1]["likes"], 
        //   // data[id-1]["liked"] = true;
        //   // );
        setData_(prevData =>
          prevData.map(item =>
            item.id === id
              ? { ...item, likes: newLikes[id], liked: true } // <— new object
              : item
          )
        )
        return newLikes;
      });

  }



  const [upvotes, setUpvotes] = useState(Object.fromEntries(data_.map(item => [item.id, item.clicked])));

  const onUpvote = (id) => {
    setUpvotes((prev) => {
      const newUpvotes = {
        ...prev,
        [id]: (prev[id] || 0) + 1,
      };

      setData_((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? { ...item, upvotes: newUpvotes[id], upvoted: true } // ✅ updated names
            : item
        )
      );

      return newUpvotes;
    });
  };


  const onClick = (id) => {

  }


  const [clicked, setClicked] = useState(Object.fromEntries(data_.map(item => [item.id, item.clicked])))
  return (
    <>
<Toaster position="top-right" reverseOrder={false} />
      <div className="grid-rows-3 gap-4">
        {/* <button
      onClick={() => uploadComments(data)}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Upload Users to Firestore
    </button> */}
        {/* <button onClick={uploadComments}>Upload Comments</button> */}
        {
          //mapping
          // data_.filter(comment => comment.parent_id == null).map(
          //   comment => (
          //     <div key={comment.id} className="">
          //       <span className='border border-white '>
          //     <Comment key = {comment.id} comment={comment} onUpvote={onUpvote} onLike={onLike} />
          //       </span>
          //     <div className="ml-6 border-l-2 border-gray-300 pl-3 grid grid-rows-1 gap-2">

          //     {data_.filter(subcomment => subcomment.parent_id == comment.id).map(
          //       subcomment =>(
          //         <Comment key={subcomment.id} comment={subcomment} onLike={onLike} onUpvote={onUpvote}/>
          //       ))
          //       // one more thing left actually, now for comments under comments under commetns they also ahve to be mapped correctly
          //       }
          //     </div>
          //   </div>
          //   )
          // )
        }
        {data_tree && data_tree.length > 0 ? (
          <CommentList nodes={data_tree} expanded={true} />
        ) : (
          <p>No comments...</p>
        )}
      </div>
    </>
  )
}


export function CommentList({ nodes, expanded, onLike, onUpvote }) {


  expanded = (expanded === undefined || expanded === false) ? false : true
  // console.log(expanded)
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [nodes, expanded]);

  const [users, setUsers] = useState({}); // store fetched users

  useEffect(() => {
    if (!nodes || nodes.length === 0) {
      return;
    } // skip early render


    async function fetchUsers() {
      const fetchedUsers = {};
      await Promise.all(
        nodes
          .filter(node => node && node.user_id) // filter nulls
          .map(async (node) => {

            const userData = await getUserDataById(node.user_id);

            if (userData) fetchedUsers[node.user_id] = userData;
          })
      );

      setUsers(fetchedUsers);
    }

    fetchUsers();
  }, []); // only run when nodes changes


  return (
    <div>

      {
        nodes.map(
          node => (

            <div ref={ref} key={node.id}
              className={`pb-1 transition-all duration-300 ease-in-out overflow-hidden `}
            //               style={{
            //   maxHeight: expanded ? `${height}px` : "0px",
            //   opacity: expanded ? 1 : 0,
            // }}

            >
              <span className=""
              >

                <Comment key={node.id} user_data={users[node.user_id]} comment={node} user_id = {node.user_id} onUpvote={updateCommentUpvotesByUser} onLike={updateCommentLikesByUser} />
              </span>
            </div>
          )
        )
      }
    </div>);

}

export default Comments
