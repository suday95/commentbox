import React from 'react'
import Comments from '../components/Comments';
function AppHome() {
    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-50 py-10 max-w-full animate-gradient">
                {/* Post Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Post Header */}
                    <div className="p-5 flex items-center gap-3">
                        <img
                            src="https://api.dicebear.com/6.x/identicon/svg?seed=159"
                            alt="User"
                            className="w-10 h-10 rounded-full border"
                        />
                        <div>
                            <h2 className="font-semibold text-gray-800">Suday Samala</h2>
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