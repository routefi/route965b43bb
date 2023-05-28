// site icon

const listColor = [
  {theme: 'dark', color: 'text-color-wite'},
  {theme: 'lite', color: 'text-color-2023'},
]

export default function WebbIcon(props) {

  const data = props.data

  return (
  <>  
    <div className="" >
      <i className={`bx bxs-bolt-circle ${data.color} ${data.size}`}></i>    
    </div>

  </>
  )
}

