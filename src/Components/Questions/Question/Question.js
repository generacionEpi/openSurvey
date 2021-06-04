
const Question = ({ info, updateResponse, results }) => {
    function CheckLimit(value, elementId, inputNum){
        if(value > 10 || value<1 && value != ''){
            alert("Value must be between 1 and 10")
            document.getElementById(elementId).value = ''
        }else{
            console.log("Updating response")
            updateResponse(value, info.id, inputNum)

        }
    }
    return (
        <div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-8">
      <div class="card-body">
        <p class="card-text">{info.question}</p>
        <p class="card-text"><small class="text-muted">{info.notes}</small></p>
      </div>
    </div>
    <div class="col-md-4" style={{justifyContent: "center", alignItems : "center", display : "flex"}}>
    <div class="row">
    {results.map((result, index)=>(<InputBox index = {index}result = {result} info = {info} CheckLimit = {CheckLimit}/>))}

          
      </div>    
      </div>
  </div>
</div>
        
    )
}

const InputBox = ({ result, info, CheckLimit, index }) => {
    return(
        <div className="col">
        <input id={info.id + 'r' + index} type="number" min="1" max = "10" aria-label="Last name" class="form-control" onChange={(e)=>{
                CheckLimit(e.target.value, e.target.id, result.id);
                }} required/>
            </div>
    )
  
}

export default Question
