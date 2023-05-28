// web navigation
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { GetUserForm, ActiveSiteLink } from "../../services/srvc-utilities";
import { GetLocalUser, GetLocalBusiness } from "../../services/srvc-auth-user";

const listNavs = require('../../static/navs-header-xw.json').data

export default function WebbHeaderNavs(props) {

  const usxx = GetUserForm();
  console.log (usxx)
  const asset = GetLocalUser();
  console.log(asset)

  const location = useLocation();  
  const linx = location.pathname.split('/')[2]
  const form = location.pathname.split('/')[1]

  const data = listNavs.filter(item => item.user.includes(asset.form) && item.actv );
  console.log (data)
  // GetEnvironment()

  return (
    <>
    {/* header-large */}
    <div className="">
      {data && data.map((item, i) => ( item.actv ?
        
        <Link to={`/${form}/${item.link}`} key={i}>
          {item.link === linx 
            ? <span className='text-color-dark p-2 px-2 back-color-lite rounded-md mx-1'>{item.name}</span>
            : <span className='text-color-tone p-2 px-2 hirich rounded-md mx-1'>{item.name}</span>
          }
        </Link>
      
      :''))}

    </div>
  
    </>
  )
}