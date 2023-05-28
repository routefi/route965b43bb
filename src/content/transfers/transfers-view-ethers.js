// auth - firebase mail link
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ethers } from 'ethers'

import WebbDividerMedium from "../webx/webb-divider-md";
import WebbDividerSmall from "../webx/webb-divider-sm";
import FormNeeded from "../webx/form-needed";
import WebbIcon from "../webx/webb-icon";


import { GetLocalUser } from "../../services/srvc-user-local";
import { TransferDetailsEthers, TransferDataSet } from "../../services/srvc-transfers-ethers-realm";


const listStatus = [
  { name: 'draft', back:'back-color-lite', text:'text-color-tone' },
  { name: 'in process', back:'back-color-warning', text:'text-color-dark' },
  { name: 'scheduled', back:'back-color-warning', text:'text-color-dark' },
  { name: 'overdue', back:'back-color-warning', text:'text-color-dark' },
  { name: 'cancelled', back:'back-color-danger', text:'text-color-wite' },
  { name: 'failed', back:'back-color-warning', text:'text-color-dark' },
  { name: 'success', back:'back-color-success', text:'text-color-wite' },
]

const brand = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNMcstvDKUbEOF3ATaINPOjbXkA-tGkoYd7djlqW7VO53gYdt_e_gQ4-G_-deVTrY1L2Y&usqp=CAU'
const artwork = 'https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2019/01/digital-illustration-guide.jpg?w=960&h=600&crop=1'

export default function TransferEthersViewModule () {

  const asset = {form: 'ww'}
  const navigate = useNavigate();
  const {chain, id} = useParams();
  
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState(false);
  const [formerror, setFormError] = useState('');

  const [item, setItem] = useState(); // transaction info
  const [transfer, setTransfer] = useState(); // *** not used

  const [account, setAccount] = useState();
  const [accountstatus, setAccountStatus] = useState(false);
  const [balance, setBalance] = useState();
  const [balancestatus, setBalanceStatus] = useState(false);
  const [network, setNetwork] = useState();
  const [networkstatus, setNetworkStatus] = useState(false);

  const [data, setData] = useState({
    name: '',
    mail: 'user@route.bz',
    location: 'India'
  })

  useEffect( () => {
    if (asset){

      const fetchData = async() => {
        setLoading(true);

        const result = await TransferDetailsEthers({data: {item: id, chain: chain}})
        console.log (result.data)
        setItem({...result.data, code: result.code, memo: result.memo})

        if (result.data) {
        
          setData({
            ...data, 
            mail: result.data.debit.mail, name: result.data.debit.name
          })
        }

        setLoading(false);
      }
      fetchData()
    } else {}
  },[id]);


  // metamask info
  useEffect(() => {
    const fetchData = async() => {
      if (window.ethereum){
        
        const getAndSetAccount = async () => {
          const changedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(changedAccounts[0]);
        }
        const accountWasChanged = (accounts) => { setAccount(accounts[0]) };
        const clearAccount = () => { setAccount(null); };

        window.ethereum.on('accountsChanged', accountWasChanged);
        window.ethereum.on('connect', getAndSetAccount);
        window.ethereum.on('disconnect', clearAccount);

        window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
          console.log('accounts', accounts);
          setAccount(accounts[0]);
          // No need to set account here, it will be set by the event listener
        }, error => {
          console.log(error)
        })

        return () => {
          // Return function of a non-async useEffect will clean up on component leaving screen, or from re-reneder to due dependency change
          window.ethereum.removeListener('accountsChanged', accountWasChanged);
          window.ethereum.removeListener('connect', getAndSetAccount);
          window.ethereum.removeListener('disconnect', clearAccount);
        }

      } else {}
    }
  fetchData();
  },[]);


  useEffect(() => {

    const fetchData = async() => {
      if (!window.ethereum) {
        // Nothing to do here... no ethereum provider found
        return;
      }
      const chainWasChanged = (chainid) => {
        setNetwork(parseInt(chainid));
        console.log('chainWasChanged');
      }
      const getAndSetNetwork = async () => {
        const chainid = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(parseInt(chainid));
        console.log('getAndSetNetwork');
      }
      const clearNetwork = () => { setNetwork(null); console.log('clearNetwork');
      };
      window.ethereum.on('chainChanged', chainWasChanged);
      window.ethereum.on('connect', getAndSetNetwork);
      window.ethereum.on('disconnect', clearNetwork);
      window.ethereum.request({ method: 'eth_chainId' }).then(chainid => {
        setNetwork(parseInt(chainid));
        console.log('chain', chainid);
        // No need to set account here, it will be set by the event listener
      }, error => {
        // Handle any UI for errors here, e.g. network error, rejected request, etc.
        // Set state as needed 
      })
      return () => {
        // Return function of a non-async useEffect will clean up on component leaving screen, or from re-reneder to due dependency change
        window.ethereum.removeListener('chainChanged', chainWasChanged);
        window.ethereum.removeListener('connect', getAndSetNetwork);
        window.ethereum.removeListener('disconnect', clearNetwork);
      }
    }
  fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async() => {
      console.log(account)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      if (account) {
        const balance = await provider.getBalance(account)
        const number  = ethers.utils.formatEther(balance)
        setBalance(number)
      }

    }
    fetchData();
  }, [account]);

  useEffect(() => {
    const fetchData = async() => {

      if (network && network == chain) {setNetworkStatus(true); setFormError(''); }
      else {setNetworkStatus(false); setFormError('Incompatible Network'); }

      if (account && account !== '') setAccountStatus(true) 
      else setAccountStatus(false)

      if (networkstatus && parseFloat(balance && balance) > parseFloat(item && item.sale.amnt/1000000)) 
        {setBalanceStatus(true); setFormError(''); }
      else {
        if (networkstatus) {setBalanceStatus(false); setFormError('Low Balance'); }
        else setFormError('Incompatible Network');
      }

      setForm(false)
      if (item && account && network == chain && (parseFloat(balance && balance) > parseFloat(item && item.sale.amnt/1000000)) )
      setForm(true)

    }
    fetchData();
  }, [item, transfer, account, network, balance]);

  const handleTransfer = async() => {
    console.log ('transfer')
    setLoading(true)
    setSubmit(true)
    
    var amount = (item.sale.amnt/1000000/10).toString()
    console.log (amount)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const trxn = await signer.sendTransaction({
      to: "0x0baB9241B8014863C6c650938f5732e2Fb90e0F3",
      value: ethers.utils.parseEther(amount),
    });
    console.log(trxn)

    const result = await TransferDataSet({data: {
      item: id, chain: trxn.chainId, status: 6,
      hash: trxn.hash, debit: {account: trxn.from},
      feex: {amount: trxn.gasPrice.toString(), ticker: item.sale.tick }
    }})
    console.log (result)
    
    setLoading(false)
    if (result.data) {
      window.open(item.link.done, '_self')
    }

    setLoading(false)    
  }

  const handleSubmit= async() => {
    console.log ('transfer')
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
      <p className="text-small text-color-tone mx-3 mb-2">
        Powered by <span className="text-normal text-bold">route</span>
      </p>
      <p className="text-small text-color-tone mx-3">
        Terms 
        <span className="mx-1"></span>
        Privacy
      </p>
      <WebbDividerSmall/>
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
        <div className="media-cube d-none">
          <img src={artwork} className="rounded-wd p-1 shadow-sm" alt='route asset'></img>
          
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
              disabled={true}
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

        <WebbDividerSmall />
      <div className={`p-3 mx-2 rounded-wd border shadow-sm ${item && item.stat!==6? 'mx-3 back-color-wite': 'd-none'}`}>
        <div className={`text-uppercase text-mini p-2 px-3 rounded text-color-wite back-color-${form ? 'success d-none' : 'danger'}`}>
          {form ? 'Ready' : `Error - ${formerror}`}
        </div>
        
        <WebbDividerSmall />


        <p className="">
          <span><i className={`text-small bx ${networkstatus ? 'bxs-check-circle text-color-success' : 'bxs-error-circle text-color-danger'}`}></i></span>
          <span className="ms-1 text-bold">Network: </span>
          <span className="ms-1">{networkstatus ? network : '******'}</span>
        </p>

        <p className="text-sm">
        <span><i className={`text-small bx ${networkstatus ? 'bxs-check-circle text-color-success' : 'bxs-error-circle text-color-danger'}`}></i></span>
          <span className="ms-1 text-bold">Account: </span>
          <span className="ms-1">{networkstatus ? account : '******'}</span>
        </p>
        <p className="text-sm">
          <span><i className={`text-small bx ${networkstatus && balancestatus ? 'bxs-check-circle text-color-success' : 'bxs-error-circle text-color-danger'}`}></i></span>
          <span className="ms-1 text-bold">Balance: </span>
          <span className="ms-1">{networkstatus ? parseFloat(balance).toFixed(6) : '******'}</span>
          
        </p>

      </div>


        <WebbDividerMedium />
        <div className={`mx-3 ${loading ? 'd-none': ''}`}>

          
          <button className="btn btn-primary border-none rounded-wd text-normal w-100"
              onClick={()=> handleTransfer()}
              disabled={loading || !form}
            >
              <div className="d-flex">
                <div className=""></div>
                <div className="ms-2 mt-1">Authorize</div>
                <div className="ms-auto" >
                  <i className="bx bx-chevron-right text-icon-sm"></i>
                </div>
              </div>
          </button>

        </div>

        {/* loader */}
        <div className={`mx-3 ${loading ? '': 'd-none'}`}>
          <p>Please Wait...</p>
        </div>

      </div>
      <div className="col-md-1 back-color-lite d-none d-md-block" style={{minHeight:'100vh'}}></div>

    </div>

    </div>


    {/* mobile footer */}
    <div className="back-color-lite d-md-none px-3">

      <div className="text-small text-color-tone text-start mx-3" 
        >
        Powered by <span className="text-normal text-bold">route</span> <span className="mx-3"></span>
        Terms <span className="mx-1"></span>
        Privacy
      </div>

      <WebbDividerMedium/>
    </div>
        
  </>

  )
}