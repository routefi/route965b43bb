// auth - firebase mail link
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { GetLocalUser } from "../../services/srvc-user-local";

// import { TransferList } from "../../services/srvc-transfers-realm";

export default function TransfersListModule () {

  const navigate = useNavigate();
  const asset = GetLocalUser()
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({balance: {number: 0}})

  useEffect( () => {
    if (asset){

      const fetchData = async() => {
        setLoading(true);

        // const result = await TransferList({data: {user: asset.mobile}})
        // console.log (result)

        // if (result.data)
        // setData(result.data.list)

        setLoading(false);
      }
      fetchData()
    } else {}
  },[]);



  if (loading) return <></>


  return (
  <>

    <div className="back-color-wite rounded-wd  border">
    {data && data.map((item, i) => (
      <>
      <div className="d-flex px-3 mt-3" key={i}>
          
        <div className="me-auto">         
          <p className="m-0">{item.memo}</p>
        </div>
    
        <div className="text-end">         
          <p className="m-0">{data && parseFloat(item.amnt.amnt/1000000).toFixed(2)}</p>
        </div>

      </div>
      <div className="px-3 mb-3">
        <p className="text-small text-color-tone m-0">{item.cred.name}</p>
        <p className="text-small text-color-tone m-0">{new Date(item.crts).toLocaleString()}</p>
      </div>
      <div className="border-bottom"></div></>
    ))}
    </div>
    
    

  </>

  )
}