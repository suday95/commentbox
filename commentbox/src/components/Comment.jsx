import React from 'react'

const Comment = ({comment,  depth = 0,                // indentation level for nested comments
  selectedId = null,        // id of currently selected comment (for styling)
  onSelect = () => {},      // called when whole comment is clicked
  onReply = () => {},
  onUpvote =()=>{},       // called when reply is clicked
  onLike = () => {}, }) => {
       // called when like is clicked

  const isSelected = selectedId === comment.id;
  const indentPx = depth * 16; // 16px per depth level (tweak as you like)

  return (
    <div
      onClick={() => onSelect(comment.id)}
      style={{ marginLeft: indentPx }}
      className={`group cursor-pointer p-4 rounded-2xl transition-transform transform
                  hover:-translate-y-0.5 will-change-transform
                  border border-transparent shadow-md
                  ${isSelected ? "ring-2 ring-indigo-400 bg-white" : "bg-white/90"}
                  backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={comment.avatar || `https://api.dicebear.com/6.x/identicon/svg?seed=${comment.id}`}
          alt={`${comment.user_name}-avatar`}
          className="w-10 h-10 rounded-full ring-1 ring-gray-200 flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{comment.user_name}</h4>
                <span className="text-xs text-gray-400">{comment.time}</span>
              </div>
              {/* <div className="text-xs text-gray-500 truncate">{comment.meta}</div> */}
            </div>

            {/* subtle actions shown on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 flex gap-3">
              {console.log(comment.likes)}
              <span>{comment.likes ?? 0} ♥</span>
              <span>{comment.upvotes ?? 0} ♥</span>
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
              onClick={(e) => { e.stopPropagation(); onLike(comment.id); }}
              className="text-xs text-gray-500 hover:text-red-500"
              aria-pressed={comment.liked ? true : false}
            >
              {comment.liked ? "Liked" : "Like"}
            </button>
                      <button
              onClick={(e) => { e.stopPropagation(); onUpvote(comment.id); }}
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
    </div>
  );
}

export default Comment