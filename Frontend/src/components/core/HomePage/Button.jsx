import React from 'react'
import { Link } from 'react-router-dom';

const Button = ({children, active, linkto}) => {
  return (
    <div>
        <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 font-bold rounded-md ${active ? "text-black bg-yellow-50" : "bg-black"} hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
        </Link>
    </div>
  )
}

export default Button