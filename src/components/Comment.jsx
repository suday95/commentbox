import React, { useState } from 'react'
import {CommentList} from './Comments';
import {motion, AnimatePresence} from "framer-motion";
import { BiSolidUpvote } from "react-icons/bi";

const Comment = ({user_data,user_id, comment,  depth = 0,                // indentation level for nested comments
  selectedId = null,        // id of currently selected comment (for styling)
  onSelect = () => {},      // called when whole comment is clicked
  onReply = () => {},
  onUpvote =(id_value)=>{},       // called when reply is clicked
  onLike = (id_value) => {}, }) => {
       // called when like is clicked

  const isSelected = selectedId === comment.id;
  const indentPx = depth * 16; // 16px per depth level (tweak as you like)
  const [expanded, setExpanded] = useState(false);
  const handleClick = e => {
    e.stopPropagation();
    setExpanded(prev =>(!prev));};
      const cleanUser = {
    name: user_data?.name || "Anonymous",
    avatar: user_data?.avatar || null, // or use a placeholder URL if preferred
    created_at: user_data?.created_at || null,
  };

  return (
    <motion.div 
    layout transition={{duration :0.4, ease:"easeInOut"}}
    className='pb-3'
    >
    <div
      onClick={handleClick}
      style={{ marginLeft: indentPx }}
      className={`transition-all duration-7000 ease-in-out overflow-hidden group cursor-pointer  bg-gray-50 p-4 rounded-2xl transition-transform transform
                  hover:-translate-y-0.5 will-change-transform bg-gray-100
                  border border-l-5 border-gray-200 shadow-md
                  ${isSelected ? "ring-2 ring-indigo-400 bg-white" : "bg-white/90"}
                  backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={cleanUser.avatar || `https://api.dicebear.com/6.x/identicon/svg?seed=${comment.id}`}
          alt={`${cleanUser.name}-avatar`}
          className="w-10 h-10 rounded-full ring-1 ring-gray-200 flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{cleanUser.name}</h4>
                <span className="text-xs text-gray-400">{comment.time}</span>
              </div>
              {/* <div className="text-xs text-gray-500 truncate">{comment.meta}</div> */}
            </div>

            {/* subtle actions shown on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-2  transition-opacity text-xs text-gray-400">
              
              <span>{comment.likes ?? 0} ♥</span>
              <span>{comment.upvotes ?? 0} <BiSolidUpvote /></span>
              <span>⋯</span>
            </div>
          </div>

          {/* Body */}
          <p className="mt-2 text-gray-700 text-sm leading-relaxed">{comment.text}</p>

          {/* Controls */}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onReply(comment.id); }}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Reply
            </button>
                        <button
              onClick={() => { handleClick }}
              className="text-xs font-medium -600 "
            >
              Replies({comment.children.length})
            </button>
            

            <button
              onClick={(e) => { e.stopPropagation(); onLike(user_id); }}
              className="text-xs text-gray-500 hover:text-red-500"
              aria-pressed={comment.liked ? true : false}
            >
              {comment.liked ? "Liked" : "Like"}
            </button>
                      <button
              onClick={(e) => { e.stopPropagation(); onUpvote(user_id); }}
              className="text-xs text-gray-500 hover:text-blue-800"
              aria-pressed={comment.upvoted ? true : false}
            >
              {comment.upvoted ? "Upvoted" : "Upvote"}
            </button>
            {/* small helper / spacing element */}
            <div className="ml-auto text-xs text-gray-300">#{comment.id}</div>
          </div>
        </div>
      </div>
      <AnimatePresence>
          {expanded &&  comment.children.length >0 && (
            <motion.div
            layout
            initial={{opacity:0,height:0}}
            animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}
            transition={{duration:0.4,ease:"easeInOut"}}
            >
      <CommentList nodes = {comment.children} expanded={expanded} onLike={onLike} onUpvote={onUpvote}/>
            </motion.div>
    )}
    </AnimatePresence>
    </div>
    </motion.div>

  );
}

export default Comment