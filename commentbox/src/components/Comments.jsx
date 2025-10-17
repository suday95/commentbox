import { useMemo, Children, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

import Comment from './Comment';
import data from '../assets/data.json'
for (let i = 0; i < data.length; i++) {
  data[i].likes = 1;
  data[i].liked = false;
  data[i].upvoted = false;
  data[i].user_name = "suday";
  data[i].clicked = false;

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



function Comments() {
  const boxRef = useRef(null);
  const [boxheight, setBoxheight] = useState(0);

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

  let [data_, setData_] = useState(data);
  const data_tree = useMemo(() => buildTree(data_), [data_]);
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

      <div className="grid-rows-3 gap-4">
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
        <CommentList nodes={data_tree} expanded={true} onLike={onLike} onUpvote={onUpvote} />



      </div>

    </>
  )
}


export function CommentList({ nodes, expanded, onLike, onUpvote }) {


  expanded = (expanded === undefined || expanded === false) ? false : true
  console.log(expanded)
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [nodes, expanded]);

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
                <Comment key={node.id} comment={node} onUpvote={onUpvote} onLike={onLike} />
              </span>
            </div>
          )
        )
      }
    </div>);

}

export default Comments
