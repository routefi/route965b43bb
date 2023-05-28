// main
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import ContentFormat from "../content/webz/content-format-xz";
import WebbHeader from "../content/webz/webb-header-xz";
// import WebbFooterMobile from "../content/webz/webb-footer-mobile";

import WebbDividerMedium from "../content/webx/webb-divider-md";
import WebbDividerSmall from "../content/webx/webb-divider-sm";

import TransfersCreateModule from "../content/transfers/transfers-create-x";

export default function TransfersCreateX () {
  
  const metadata = {
    name: 'Create Transfer',
    banner: {link: 'https://img.freepik.com/premium-vector/futuristic-vector-hexagon-wave-dark-cyberspace-abstract-wave-with-dots-line-white-moving-particles-background_744733-97.jpg?w=900'}
  }

  return(

  <>
    <Helmet>
      <title>{metadata.name}{' • '}{process.env.REACT_APP_WEBB_SITE_NAME}{' • '}{process.env.REACT_APP_WEBB_SITE_LINE}</title>
      <link rel="canonical" href={process.env.REACT_APP_WEBB_SITE_LINK} />
    </Helmet>

    <ContentFormat 
      
      name = {metadata.name}
      header = {{ size: 'small', visible: false, data: <> </> }}

      media = {{ size: 'small', data: <></> }}

      content = {{ size: 'small', data: 
      <>
        <WebbDividerMedium />
        <div className="mx-3 text-center back-color-main text-color-wite rounded p-2">
          <span>
            <i className="bx bxs-bolt-circle text-icon-sm  align-middle"></i>
            <span className="ms-1 text-lead">Route</span>
          </span>
          
          <p className="m-0">Payments for the Modern Web</p>
        </div>
        
        <WebbDividerSmall />
        <TransfersCreateModule />

        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbDividerMedium />
      </>
      }}
    
      footer = {{ size: 'small', data: 
      <> 
        <div className="text-center back-color-lite fixed-bottom d-block d-md-none">
          <WebbDividerSmall />
          {/* <WebbFooterMobile />  */}
        </div>
      </> }}
    
    ></ContentFormat>


  </>
  )
}