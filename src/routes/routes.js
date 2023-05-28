import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

// views - main
import Main from "../views-xz/main";

// views - transfers
import TransfersCreateX from "../views-transfers/transfers-create-x";
import TransfersView from "../views-transfers/transfers-view";
import TransfersEthersView from "../views-transfers/transfers-view-ethers";

const routes = [

  { route:'/', content: <Main />, auth:false },

  { route:'/transferx/create', content: <TransfersCreateX />, auth:false },

  { route:'/tx/:id', content: <TransfersView />, auth:false },
  { route:'/tx/:chain/:id', content: <TransfersEthersView />, auth:false },

  
]


export default function RouteX() {

  const { user } = useAuth();
  // console.log (user)

  return (
    <Routes>
      {routes.map ((item,i)=>(item.auth
        ? <Route key={i} path={item.route} element={!user ? <Navigate to='/' replace /> : item.content} />
        : <Route key={i} path={item.route} element={item.content} />
      ))}
    </Routes>
  );
}