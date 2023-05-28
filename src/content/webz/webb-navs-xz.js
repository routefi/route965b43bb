// navs
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


const listNavs = require('../../static/navs-header-xz.json').data

export default function WebbHeaderNavs(props) {

  const location = useLocation();  
  const linx = location.pathname.split('/')[2]
  const form = location.pathname.split('/')[1]

  const data = listNavs.filter(item => item.actv );

  return (
    <>
    {/* header-large */}
    <div className="text-normal">
      {data && data.map((item, i) => (
        
        <Link to={`${item.link}`} key={i}>
          {item.link === linx 
            ? <span className='p-2 back-color-rich text-color-wite rounded-md me-1'>{item.name}</span>
            : <span className='p-2 hirich rounded-md me-1'>{item.name}</span>
          }
        </Link>
      
      ))}

    </div>
  
    </>
  )
}