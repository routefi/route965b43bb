// transfers
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WebbDividerSmall from "../webx/webb-divider-sm";
import WebbDividerMedium from "../webx/webb-divider-md";
import WebbLoader from "../webx/webb-loader";
import WebbSpinner from "../webx/webb-spinner";
import WebbModuleInfo from "../webx/webb-module-info";
import FormNeeded from "../webx/form-needed";

import { GetLocalUser } from "../../services/srvc-user-local";

import { MediaLinkConvert } from "../../services/srvc-store-filecoin";
import { MetadataLinkCreate, MediaLinkCreate } from "../../services/srvc-store-mediax";

import { TransferxCreate } from "../../services/srvc-transfers-realm";


const creditmode = ['usd', 'eur', 'inr' ]
const debitmode = [ 
  {name: 'Card', code: 'card-strix', actv: true }, 
  {name: 'UPI', code: 'fiat-upix', actv: false }, 
  {name: 'Matic', code: 'web3-matic', actv: true },
  {name: 'Celo', code: 'web3-celo', actv: true }, 
  {name: 'FIL', code: 'web3-fil', actv: true },
  {name: 'Binance', code: 'web3-binance', actv: true },
]

export default function TransfersCreateModule () {

  const navigate = useNavigate();
  const asset = {form: 'ww'}  //GetLocalUser()
  
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState(0);
  const [memo, setMemo] = useState('');

  const [link, setLink] = useState('')  
  const [ticker, setTicker]= useState([])
  
  const [assetx, setAssetX] = useState({name: 'Filverse', memo: 'Women in Filverse', item: ''})

  const [file, setFile] = useState()
  const [media, setMedia] = useState({link: '', mime: 'image/png'})
  const [mediastatus, setMediaStatus] = useState(false)

  const [meta, setMeta] = useState('')

  const [data, setData] = useState({
    creditname: 'Route Inc',
    creditmail: 'finnovateinc+route@gmail.com',
    creditaccount: '',
    creditticker: '',
    debitname: 'Smriti Chaudhry',
    debitmail: 'smriti@route.bz',
    amount: '',
    memo: 'Online Transfer'
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
    // setForm(false);
    // if (data.amount > 0) setForm(true);

  },[data]);


  const handleAsset = async() => {

    const datx = {
      name: assetx.name, 
      memo: assetx.memo,
      media: {link: media.link, mime: media.mime}
    }

    const result = await MetadataLinkCreate(datx)
    console.log (result)
    setMeta(result.link)
    setForm(3)

  }


  const handleSubmit = async () => {

    setForm(3);

    setLoading(true);
    setSubmit(true);
    

    const basedomain = window.location.host.split(':')[0] === 'localhost' ? `http://${window.location.host}` : `https://${window.location.host}`

    const datx = {
      credit: { name: data.creditname, user: data.creditmail },
      debit: { name: data.debitname, user: data.debitmail },
      sale: {amount: data.amount, ticker: data.creditticker},
      asset: { name: assetx.name, memo: assetx.memo, number: assetx.item},
      media: { link: media.link, mime: media.mime}, 
      memo: data.memo, number: '******',
      tickers: ticker, mode: 'testnet', 
      link: {
        success: '', 
        failed: ''
      }, 
      domain: basedomain
    }

    console.log(datx)

    const result = await TransferxCreate({data: datx})
    console.log (result)
    
    if (result.data) {
      setDone(true)
      setMemo('Transfer Created.')
      setLink(result.data.link)
    }
    else {
      setDone(false)
      setMemo('Failed.')
    }

    setLoading(false)
    
  }

  const handleTicker = async(item) => {
    // console.log (item)
    const index = ticker.findIndex(x => x === item)
    const ticxx = ticker
    // console.log(index)
    if (index === -1) { ticxx.push(item)} 
    else { ticxx.splice(index,1)}
    
    // console.log(ticxx)
    setTicker([...ticxx])
  }

  const handleChange = async(key, val) => {
    setData({ ...data, [key]: val });
  }

  const handleFile = async(item) => {
    console.log(item)
    setMediaStatus(true)
    if (item) {
      setFile(item)
      
      const result = await MediaLinkCreate({ media: item })
      console.log(result)

      setMedia(result)
    }
    setMediaStatus(false)
  };


  // if (loading) return <></>


  return (
  <>

    {/* status */}
    <div className={!loading && submit && done ? 'd-none' : 'mx-3'}>
      <div className="progress" role="progressbar" 
        aria-valuenow={form} aria-valuemin="0" aria-valuemax='3' 
        style={{height:'0.24rem'}}>
        <div className="progress-bar" style={{width: `${(form)/3*100}%`}}></div>
      </div>
      <WebbDividerMedium/>
    </div>

    {/* data */}
    <div className={!loading && submit && done ? 'd-none' : 'mx-3'}>

      <div className={form === 0 ? '': 'd-none'}>
        <p className="text-color-tone">1. Credit (Seller Details) <span className="badge back-color-tint text-color-tone">YOU</span></p>
        <div className="mb-3">  
          <label className="form-label small">Your Name <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.creditname}
            onChange={({ target }) => {handleChange("creditname", target.value); }}
            disabled={loading || submit || true}
            placeholder="user name">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Your Email <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.creditmail}
            onChange={({ target }) => {handleChange("creditmail", target.value); }}
            disabled={loading || submit || true}
            placeholder="credit@route.bz">
          </input>
        </div>

        {/* action */}
        <WebbDividerMedium />
        <div className="d-flex justify-content-between">
          <button className={`btn btn-light btn-sm border back-color-wite rounded-xx button text-small`}
            type="button"
            onClick={()=> navigate('/')}
          >{loading ? 'Cancel' : 'Cancel'}</button>

          <button className={`btn btn-info btn-sm border-none back-color-main text-color-wite rounded-xx text-small`}
            disabled={data.creditname =='' || data.creditmail == ''}
            type="button"
            onClick={()=> setForm(1)}
          >{loading ? 'Please Wait...' : 'Next'}</button>
        </div>

      </div>


      <div className={form === 1 ? '': 'd-none'}>
        <p className="text-color-tone">2: Debit (Buyer Details)</p>
        <div className="mb-3">
          <label className="form-label small">Name <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.debitname}
            onChange={({ target }) => {handleChange("debitname", target.value); }}
            disabled={loading || submit}
            placeholder="user name">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Email <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.debitmail}
            onChange={({ target }) => {handleChange("debitmail", target.value); }}
            disabled={loading || submit}
            placeholder="debit@route.bz">
          </input>
        </div>

        {/* action */}
        <WebbDividerMedium />
        <div className="d-flex justify-content-between">
          <button className={`btn btn-light btn-sm border back-color-wite rounded-xx button text-small`}
            type="button"
            onClick={()=> setForm(0)}
          >{loading ? 'Cancel' : 'Back'}</button>

          <button className={`btn btn-info btn-sm border-none back-color-main text-color-wite rounded-xx text-small`}
            disabled={data.debitname =='' || data.debitmail == ''}
            type="button"
            onClick={()=> setForm(2)}
          >{loading ? 'Please Wait...' : 'Next'}</button>
        </div>

      </div>

      <div className={form === 2 ? '': 'd-none'}>
        <div className="d-flex">
          <div className="me-auto">
            <p className="text-color-tone">3: Asset Details (Optional)</p>
          </div>
          <div className="">
          <p className="text-color-tone cursor p-1 px-3 back-color-tint rounded-xx text-small" 
            onClick={()=> setForm(3)}>SKIP</p>
          </div>
        </div>
        


        <div className="mb-3">
          <label className="form-label small">Name <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={assetx.name}
            onChange={({ target }) => setAssetX({...assetx, name: target.value})}
            disabled={loading || submit}
            placeholder="...">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Description <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={assetx.memo}
            onChange={({ target }) => setAssetX({...assetx, memo: target.value})}
            disabled={loading || submit}
            placeholder="...">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Number <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={assetx.item}
            onChange={({ target }) => setAssetX({...assetx, item: target.value})}
            disabled={loading || submit}
            placeholder="...">
          </input>
        </div>        

        <div className="">

        </div>

        <div className="mb-3">  
          <label className="form-label small">Media <FormNeeded/></label>

          <div className="input-group mb-2">
            <input type="file" accept="image/*" aria-label="media" 
              className="form-control text-small" 
              onChange={ (e) => handleFile(e.target.files[0])}>
            </input>
          </div>

          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={media.link}
            onChange={({ target }) => setMedia({...media, link: target.value})}
            disabled={loading || submit}
            placeholder="...">
          </input>
        </div>   

        <div className={media.link !=='' ? '': 'd-none'}>  
          {/* <label className="form-label small">Media <FormNeeded/></label> */}
          <div className={`media-standard`}>
            <img src={media.link} className="w-100" alt='...'></img>
          </div>
        </div>          

        {/* memo */}
        <div className={mediastatus ? '' : 'd-none'}>
          <WebbDividerMedium />
          <p className="m-0">Please Wait... Creating Media on IPFS</p>
        </div>        

        {/* action */}
        <WebbDividerMedium />
        <div className="d-flex">
          <button className={`me-auto btn btn-light btn-sm border back-color-wite rounded-xx button text-small`}
            type="button"
            onClick={()=> setForm(1)}
          >{loading ? 'Cancel' : 'Back'}</button>

          <button className={`btn btn-info btn-sm border-none back-color-main text-color-wite rounded-xx text-small`}
            disabled={assetx.name == '' || assetx.memo == '' || media.link == ''}
            type="button"
            onClick={()=> handleAsset()}
          >{loading ? 'Please Wait...' : 'Next'}</button>
        </div>

      </div>

      
      <div className={form === 3 ? '': 'd-none'}>
        <p className="text-color-tone">4: Transfer Details</p>
        <div className="mb-3">  
          <label className="form-label small">Reason <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.memo}
            onChange={({ target }) => {handleChange("memo", target.value); }}
            disabled={loading || submit}
            placeholder="">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small">Amount <FormNeeded/></label>
          <input type="text" className="form-control height-md  "
            style={{fontSize:'0.9rem', height:'2.7rem'}}
            value={data.amount}
            onChange={({ target }) => {handleChange("amount", target.value); }}
            disabled={loading || submit}
            placeholder="">
          </input>
        </div>

        <div className="mb-3">  
          <label className="form-label small d-none">Currency <FormNeeded/></label>
          {creditmode && creditmode.map((item, i) => (
            <span className="me-1" key={i}>
              <span className={`${data.creditticker === item ? 'back-color-rich' : 'back-color-wite'} p-2 px-3  border rounded-wd text-uppercase text-small cursor hirich`}
                onClick={()=> handleChange('creditticker', item)}
              >{item}</span>
            </span>
          ))}
        </div>

        <WebbDividerSmall />
        <div className="mb-3">  

          <label className="form-label small">Users Payment Options (Select Multiple) <FormNeeded/></label>
          <div className="mb-3 mt-2">
          {debitmode && debitmode.map((item, i) => ( item.actv ?
            <span className="me-1" key={i}>
              <span className={`${ticker.includes(item.code) ? 'back-color-rich' : 'back-color-wite'} p-2 px-3 border rounded-wd text-uppercase text-small cursor hirich`}
                onClick={()=> handleTicker(item.code)}
              
              >{item.name}</span>
            </span>
            :''))}
          </div>
        </div>

        {/* action */}
        <WebbDividerMedium />
        <div className="d-flex justify-content-between">
          <button className={`btn btn-light btn-sm border back-color-wite rounded-xx button text-small`}
            type="button"
            onClick={()=> setForm(2)}
          >{loading ? 'Cancel' : 'Back'}</button>

          <button className={`btn btn-info btn-sm border-none back-color-main text-color-wite rounded-xx text-small`}
            disabled={data.amount =='' || data.amount == 0 || data.memo == '' || data.creditticker == ' ' || ticker.length == 0}
            type="button"
            onClick={()=> handleSubmit()}
          >{loading ? 'Please Wait...' : 'Submit'}</button>
        </div>

      </div>

    </div>


    
    <div className={!loading && submit && done ? 'mx-3' : 'd-none'}>
      <p className="text-normal text-bold">Route Transfer</p>
      <p className="m-0">{memo}</p>
      <WebbDividerMedium />

      <p className="m-0">{'You can share the following link to collect payments.'}</p>
      <a href={link} className="text-primary">{link}</a>
      <WebbDividerMedium />
      <p className="cursor text-primary" onClick={() => window.location.reload()}>Make Another Transfer</p>
    </div>

    <div className={loading && submit ? 'mx-3' : 'd-none'}>
      <WebbDividerMedium />
      <p className="m-0">Please Wait... Creating Transfer</p>
    </div>


  </>

  )
}