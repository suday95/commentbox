import React from 'react'
import './App.css'
import Comments from './Comments';
function App() {
    return (
        <>
        <div className='container mx-auto px-2 bg-blue-100'>Picture</div>
        <div className={` container  overflow-y-auto mx-auto px-2 bg-red-100`}>
            <Comments/>
        </div>
        
        </>
    );
}

export default App 