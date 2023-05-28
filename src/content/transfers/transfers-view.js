// auth - firebase mail link
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WebbDividerMedium from "../webx/webb-divider-md";
import WebbDividerSmall from "../webx/webb-divider-sm";
import FormNeeded from "../webx/form-needed";
import WebbIcon from "../webx/webb-icon";

import { GetLocalUser } from "../../services/srvc-user-local";

import { TransferDetails } from "../../services/srvc-transfers-realm";
import { CoinRatesList } from "../../services/srvc-coinrates-realm";

import { TransferCreateStrix } from "../../services/srvc-transfers-strix-realm";
import { TransferCreateEthers } from "../../services/srvc-transfers-ethers-realm";



const brand = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNMcstvDKUbEOF3ATaINPOjbXkA-tGkoYd7djlqW7VO53gYdt_e_gQ4-G_-deVTrY1L2Y&usqp=CAU'
const artwork = 'https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2019/01/digital-illustration-guide.jpg?w=960&h=600&crop=1'

export default function TransferViewModule () {

  const asset = {form: 'ww'}
  const navigate = useNavigate();
  const {id} = useParams();
  console.log(window.location.host)
  
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [done, setDone] = useState(false);

  const [item, setItem] = useState()
  const [tick, setTicker] = useState()
  const [data, setData] = useState({
    name: '',
    mail: 'user@route.bz',
    location: 'India'
  })

  useEffect( () => {
    if (asset){

      const fetchData = async() => {
        setLoading(true);

        const result = await TransferDetails({data: {item: id}})
        console.log (result.data)
        setItem({...result.data, code: result.code, memo: result.memo})

        if (result.data) {
        
          setData({
            ...data, 
            mail: result.data.debit.mail, name: result.data.debit.name
          })

          var ratex = (await CoinRatesList({data: { ticker: result.data.sale.tick}})).data
          // console.log (ratex)

          setTicker(Array.from(result.data.ticker, x => { return {
            name: x.name, code: x.code,  
            tica: result.data.sale.tick, ticb: x.tica, 
            rate: (result.data.sale.amnt/(ratex.rates.find(z=>z.code === x.tica).rate)/1000000).toFixed(6),
            actv: x.actv
          }}))

        }

        setLoading(false);
      }
      fetchData()
    } else {}
  },[id]);


  const handleTransferChannel = async (channel) => {
    console.log (channel)
    if (channel === 'card-strix') handleTransferCard()
    
    if (channel === 'web3-binance') handleTransferEthers(channel)
    if (channel === 'web3-celo') handleTransferEthers(channel)
    if (channel === 'web3-matic') handleTransferEthers(channel)
    if (channel === 'web3-fil') handleTransferEthers(channel)

  }

  const handleTransferCard = async () => {
    setLoading(true)
    setSubmit(true)

    const basedomain = window.location.host.split(':')[0] === 'localhost' ? `http://${window.location.host}` : `https://${window.location.host}`

    const result = await TransferCreateStrix({data: {
      debit: {name: data.name, mail: data.mail},
      sale: {amount: item.sale.amnt/1000000, ticker: item.sale.tick},
      memo: item.meta.memo,
      link: {
        success: `https://route60616ad3.web.app/tx/${id}`, 
        cancel: `https://route60616ad3.web.app/tx/${id}`
      },
      trxn: id, domain: window.location.host
    }})

    if (result.data) {
      window.open(result.data.link, '_self')
    }

    setLoading(false)
  }

  const handleTransferEthers = async (code) => {
    setLoading(true)
    setSubmit(true)

    const sale = tick.find(x => x.code === code)
    console.log (sale)

    const basedomain = window.location.host.split(':')[0] === 'localhost' ? `http://${window.location.host}` : `https://${window.location.host}`

    const datx = {
      credit: { user: item && item.credit.mail}, 
      debit: {name: data.name, mail: data.mail},
      sale: {amount: sale.rate, ticker: sale.ticb},
      asset: item.assx || {},
      media: item.media || {},
      memo: item.meta.memo, number: item.meta.nmbr,
      coin: sale.ticb, mode: 'testnet',
      link: {
        success: `${basedomain}/tx/${id}`, 
        failed: `${basedomain}/tx/${id}`
      },
      trxn: id, domain: basedomain
    }
    console.log (datx)
    const result = await TransferCreateEthers({data: datx})
    console.log(result.data)
    if (result.data) {
      window.open(result.data.link, '_self')
    }


    setLoading(false)
  }

  const handleTransferRand = async () => {
    
  }


  const handleTransferUPI = async () => {
    
  }

  const handleChange = async(key, val) => {
    setData({ ...data, [key]: val });
  }


  if (loading && !submit) return <>
      <div className="text-center">
        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbIcon data={{color: 'text-color-tone', size: 'text-icon-md'}}/>
        <WebbDividerSmall />
        <p className={''}>{'Please Wait...'}</p>
      </div>
  </>

  if (!loading && item && [404, 406, 409, 410].includes(item.code)) return <>
    <div className="text-center">
      <WebbDividerMedium />
      <WebbDividerMedium />
      <WebbIcon data={{color: 'text-color-tone', size: 'text-icon-md'}}/>
      <WebbDividerSmall />
      <p className={item.code == 404 ? '' : 'd-none'}>{'Transaction Not Found'}</p>
      <p className={item.code == 410 ? '' : 'd-none'}>{'Transaction Cancelled'}</p>
      <p className={item.code == 406 ? '' : 'd-none'}>{'Transaction Timeout'}</p>
      <p className={item.code == 409 ? '' : 'd-none'}>{'Transaction Closed'}</p>
    </div>

    {/* mobile footer */}
    <div className="back-color-wite text-center px-3 fixed-bottom" >
      <WebbDividerSmall/>
      <p className="text-small text-color-tint mx-3 mb-1">
        Powered by <span className="text-normal text-bold">route</span>
      </p>
      <p className="text-small text-color-tint mx-3">
        Terms 
        <span className="mx-1"></span>
        Privacy
      </p>
      
    </div>    
  </>

  return (
  <>
    
    <div className="container-fluid">

    
    <div className="row">
      <div className="col-md-1"></div>
      <div className="col-md-5">
        <WebbDividerMedium />
        <WebbDividerSmall />
        <div className="mx-3">
          <span className="rounded-xx ">
            <img src={brand} className="rounded-xx p-1 border shadow-sm" width={33} alt='route brand'></img>
          </span>
          <span className="ms-2 mt-1 mb-1 text-uppercase">{item && item.credit.name || '******'}</span>
        </div>

        
        <WebbDividerMedium />
        <div className="mx-3">
          <p className="text-small text-color-tone m-0 mb-2">{'Amount to Pay'}</p>
          <p className="m-0 mb-3">
            <span className="caption-md me-1" style={{lineHeight:'2rem'}}>{((item && item.sale.amnt)/1000000).toFixed(6) || '******'}</span>
            <span className="text-uppercase align-top">{(item && item.sale.tick) || '******'}</span>
          </p>
          <p className="text-normal m-0">{item && item.meta.memo || '******'}</p>
        </div>

        <WebbDividerSmall />
        <div className={`${item && item.media.link === '******' ? 'd-none': 'mx-3 w-50'}`}>
          <div className={`media-cube`}>
            <img src={item && item.media.link || artwork} className="rounded-wd p-1 shadow-sm" alt='route asset'></img>
          </div>
        </div>

        <div className={`${item && item.asset.name === '******' ? 'd-none': 'mt-1 mx-4'}`}>
            <p className="text-bold m-0">{item && item.asset.name || ''}</p>
            <p className="m-0">{item && item.asset.memo || ''}</p>
        </div>

        <WebbDividerMedium />
        <WebbDividerMedium />

        <div className="text-small text-color-tone d-none d-md-block mx-3" 
          style={{position:'fixed',bottom:'3rem'}}>
          Powered by <span className="text-normal text-bold">route</span> <span className="mx-3"></span>
          Terms <span className="mx-1"></span>
          Privacy
        </div>

      </div>

      <div className="col-md-5 back-color-lite" style={{minHeight:'100vh'}}>
        
        <WebbDividerMedium />
        <WebbDividerSmall />
        <p className="mx-3 text-lead">Payment Details</p>

        <WebbDividerSmall />
        <div className="mx-3">
          <div className="mb-3">  
            <label className="form-label small">Email <FormNeeded/></label>
            <input type="text" className="form-control height-md  "
              style={{fontSize:'0.9rem', height:'2.7rem'}}
              value={data.mail}
              onChange={({ target }) => {handleChange("mail", target.value); }}
              disabled={true}
              placeholder="user@route.bz">
            </input>
          </div>
        
          <div className="mb-3">  
            <label className="form-label small">Name <FormNeeded/></label>
            <input type="text" className="form-control height-md  "
              style={{fontSize:'0.9rem', height:'2.7rem'}}
              value={data.name}
              onChange={({ target }) => {handleChange("name", target.value); }}
              disabled={loading || submit}
              placeholder="">
            </input>
          </div>        
        
          <div className="mb-3 d-none">  
            <label className="form-label small">Country or region <FormNeeded/></label>
            <input type="text" className="form-control height-md"
              style={{fontSize:'0.9rem', height:'2.7rem'}}
              value={data.location}
              onChange={({ target }) => {handleChange("location", target.value); }}
              disabled={loading || submit}
              placeholder="">
            </input>
          </div>

        </div>

        <WebbDividerMedium />
        <div className={submit ? 'd-none': 'mx-3 '}>
        {tick && tick.map((item, i) => (item.actv ?
          <div key={i} >
              <div className="d-flex back-color-wite border cursor hirich rounded-wd p-2 mb-2" 
                key={i} 
                style={{fontSize:'0.96rem'}}
                onClick={()=> handleTransferChannel(item.code)}
                >
                <div className="">
                  <i className="bx bx-globe text-icon-sm"></i>
                </div>
                <div className="ms-2 mt-1">{item.name}</div>
                <div className="ms-auto mt-1" >
                  {item.rate || '******'}
                </div>
              </div>     
          
          </div>
        :''))}
        </div>

        {/* loader */}
        <div className={`mx-3 ${submit ? '': 'd-none'}`}>
          <p>Please Wait...</p>
        </div>

      </div>
      <div className="col-md-1 back-color-lite d-none d-md-block" style={{minHeight:'100vh'}}></div>

    </div>

    </div>


    {/* mobile footer */}

    <div className="back-color-lite d-md-none px-3">
      <WebbDividerMedium/>
      <WebbDividerMedium/>
      <WebbDividerMedium/>
      <div className="text-small text-color-tint">
        Powered by <span className="text-normal text-bold">route</span> <span className="mx-3"></span>
        Terms <span className="mx-1"></span>
        Privacy
      </div>

      <WebbDividerSmall/>
    </div>
        
  </>

  )
}