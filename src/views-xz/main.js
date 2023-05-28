// main
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import ContentFormat from "../content/webz/content-format-xz";
import WebbHeader from "../content/webz/webb-header-xz";

import WebbDividerMedium from "../content/webx/webb-divider-md";
import WebbDividerSmall from "../content/webx/webb-divider-sm";

import WebbIcon from "../content/webx/webb-icon";

import media from '../media/istockphoto-910755392-640_adpp_is.gif'

import RouteIntroModule from "../content/main/route-intro";
import RouteCallToActionModule from "../content/main/route-call-to-action";
import RouteFeaturesModule from "../content/main/route-features";
import RouteRatesCheckModule from "../content/main/route-rates-check";
import RouteWithoutBordersModule from "../content/main/route-without-borders";


export default function Main () {
  
  const metadata = {
    name: 'Welcome',
    banner: {link: 'https://img.freepik.com/premium-vector/global-network-connection-world-map-point-line_41981-1542.jpg?w=900'}
  }

  // https://www.freepik.com/free-photo/dreamlike-surrealistic-landscape-wallpaper-purple-tones_40572368.htm
  
  const navigate = useNavigate()

  return(

  <>
    <Helmet>
      <title>{metadata.name}{' • '}{process.env.REACT_APP_WEBB_SITE_NAME}{' • '}{process.env.REACT_APP_WEBB_SITE_LINE}</title>
      <link rel="canonical" href={process.env.REACT_APP_WEBB_SITE_LINK} />
    </Helmet>

    <ContentFormat 
      
      name = {metadata.name}
      header = {{ size: 'xtra', visible: true, data: 
      <>
        <div className="container">
          <WebbHeader data={{home: '/', name: metadata.name, link: '/'}}/>
        </div>
        
      </>
      }}

      media = {{ size: 'xtra', link:media, data: 
      <>
        <div className="media-banner d-none">
          <img src={metadata.banner.link} className="" alt={''}></img>
        </div>
        <WebbDividerMedium />
        <WebbDividerMedium />
        <WebbDividerMedium />
        <div className="text-center text-color-warning p-2 background-color-dark">
        <h1 className="text-color-wite text-cenwter">Dont Loose Your Money</h1>
          <h1 className="text-color-wite text-cenwter">Route Your Money</h1>
          <h2 className="">Payment Infrastructure</h2>
          <h2 className="">For the Modern Web</h2>
        </div>
        <WebbDividerMedium />
        <WebbDividerMedium />
        <div className="text-center">
          <span className="back-color-wite p-3 px-5 rounded-wd cursor hirich"
            onClick={() => navigate('/transferx/create')}
          >Get Started</span>
        </div>
        <WebbDividerMedium />
        <WebbDividerMedium />
        

      </>
      }}

      content = {{ size: 'xtra', data: 
      <>

        <div className="container" 
          // style={{
          //   backgroundImage:`url(${metadata.banner.link})`, 
          //   backgroundRepeat:'no-repeat', 
          //   backgroundSize:'cover',
          //   backgroundPosition: 'center center',
          //   height:'100vh'
          // }}
        >
        
        <WebbDividerMedium />
        <WebbDividerMedium /> 
        <RouteIntroModule />

        <WebbDividerMedium />
        <RouteCallToActionModule />

        <WebbDividerMedium />
        <WebbDividerMedium />
        <RouteFeaturesModule />

        <WebbDividerMedium /> 
        {/* <RouteRatesCheckModule /> */}
        
        <WebbDividerMedium />
        <RouteWithoutBordersModule />

        
        <WebbDividerMedium /> 
        <WebbDividerMedium />
        <WebbDividerMedium /> 
        </div>

      </>
      }}
    
      footer = {{ size: 'medium', data: 
      <>
        <div className="">
        
        </div>
      </>
      }}
    
    
    ></ContentFormat>


  </>
  )
}