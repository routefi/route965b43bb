// auth - firebase mail link
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WebbDividerSmall from "../webx/webb-divider-sm";
import WebbDividerMedium from "../webx/webb-divider-md";
import WebbLoader from "../webx/webb-loader";
import WebbSpinner from "../webx/webb-spinner";
import WebbModuleInfo from "../webx/webb-module-info";
import FormNeeded from "../webx/form-needed";

import { GetLocalUser } from "../../services/srvc-user-local";

// import { AccountDetails } from "../../services/srvc-accounts-realm";
import { TransferCreate } from "../../services/srvc-transfers-realm";


export default function TransfersCreateModule () {

  const navigate = useNavigate();
  const asset = GetLocalUser()
  
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState(false);
  const [memo, setMemo] = useState('');

  const [balance, setBalance] = useState({balance: {number: 0}})
  const [data, setData] = useState({
    amount: ''
  })

  useEffect( () => {
    if (asset){

      const fetchData = async() => {
        setLoading(true);

        // const result = await AccountDetails({data: {user: asset.mobile}})
        // console.log (result)

        // if (result.data)
        // setBalance(result.data)

        setLoading(false);
      }
      fetchData()
    } else {}
  },[]);

  // useEffect for form validation
  useEffect( () => {
    setForm(false);
    if (balance.balance.number > 0) setForm(true);
    if (data.amount > 0) setForm(true);

  },[balance, data]);


  const handleSubmit = async () => {

    setLoading(true);
    setSubmit(true);

    const result = await TransferCreate({data: {
      credit: { user: data.mobile },
      debit: { user: asset.mobile },
      amount: data.amount,
      memo: "transfer"
    }})
    console.log (result)
    
    if (result.data) {
      setDone(true)
      setMemo('Transfer Success.')
    }
    else {
      setDone(false)
      setMemo('Transfer Failed.')
    }

    setLoading(false)
    
  }



  const handleChange = async(key, val) => {
    setData({ ...data, [key]: val });
  }



  // if (loading) return <></>


  return (
  <>

<div className="back-color-wite rounded-wd p-3 border">
      <div className="d-flex">
        <div className="">
          <p className="text-small text-color-tone m-0">Account Balance</p>
          <p className="text-lead m-0">{parseInt(balance && parseInt(balance.balance.number/1000000)).toFixed(6)}</p>
        </div>
        <div className=""></div>
      </div>

      <WebbDividerMedium/>
      <div className="">
        <div className="mb-3">  
          <label className="form-label small">Amount <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.amount}
            onChange={({ target }) => {handleChange("amount", target.value); }}
            disabled={loading || submit}
            placeholder="99">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Mobile Number <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.mobile}
            onChange={({ target }) => {handleChange("mobile", target.value); }}
            disabled={loading || submit}
            placeholder="9876540123">
          </input>
        </div>
      </div>

    </div>


    <WebbDividerMedium />
    <div className={!loading && submit && done ? '' : 'd-none'}>
      <p>{memo}</p>
      <p className="cursor text-color-blue" onClick={() => window.location.reload()}>Make Another Transfer</p>
    </div>    

    
    <div className={loading && submit || done ? 'd-none' : ''}>
      <div className="d-flex justify-content-between">

        <button className={`btn btn-light border back-color-wite rounded-wd button text-small`}
          type="button"
          onClick={()=> { navigate(`/${asset.mode}/home`)}}
        >{loading ? 'Please Wait...' : 'Cancel'}</button>

        <button className={`btn btn-info border-none back-color-main text-color-wite rounded-wd text-small`}
          disabled={!form || loading || submit}
          type="button"
          onClick={()=> { handleSubmit()}}
        >{loading ? 'Please Wait...' : 'Continue'}</button>

      </div>
    </div>
    

    <div className={loading && submit ? '' : 'd-none'}>
      Please Wait...
    </div>


  </>

  )
}