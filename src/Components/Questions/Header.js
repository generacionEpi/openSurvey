
const Header = ({results}) => {
  

    return (
      <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-8">
          <div class="card-body">
            <h1 class="card-text">Question</h1>
          </div>
        </div>
        <div class="col-md-4" style={{justifyContent: "center", alignItems : "center", display : "flex"}}>
        <div class="row">
        {results.map((option) => (<Option option={option} />))}
          
          </div>    
          </div>
      </div>
    </div>
  )
  
  

   
}
const Option = ({option}) => {
  return (
  <div className="col">
  <p>{option.text}</p>
  
            </div>)

}

export default Header
