import React, { useState, useEffect } from 'react';

const Admin = ({results, questions, setQuestions, serverAddress}) => {
    const [question, setQuestion] = useState("")
    const [notes, setNotes] = useState("")
    const [resultTitle, setResultTitle] = useState("")
    

    //Conditional stuff
    const [greaterThan, setGreaterThan] = useState()
    const [lessThan, setLessThan] = useState()
    const [typeId, setTypeId] = useState('')
    const [resultText, setResultText] = useState()

    //Set id of result to add condition to as the first option since we detect onChange
    useEffect(() =>{
      if(results[0] && typeId == ''){
        setTypeId(results[0].id)

    }
  
  
  
},[ results ])
  
  
    async function getQuestions() {
      return fetch(serverAddress+'/getQuestions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
     }
     const getData = async () => {
      const fromServer = await getQuestions()
      setQuestions(fromServer)
      
   }
   async function sendCondition(body) {
    return fetch(serverAddress+'/setResultCondition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(data => data.json())
   }
   async function sendResult(body) {
    return fetch(serverAddress+'/addResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(data => data.json())
      .then(()=>{alert("Result has been added")})
   }
   async function deleteResult(body) {
    return fetch(serverAddress+'/removeResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(body)
    })
      .then(data => data.json())
      .then(()=>{      alert("Result has been deleted")
      })
   }
   async function deleteQuestion(body) {
    return fetch(serverAddress+'/deleteQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(body)
    })
      .then(data => data.json())
      .then(()=>{      getData()
      })
   }
   const submitResult = () => {

    if(resultTitle!= ''){
      const sendData = async () => {
          var body = {obj : {"range0":greaterThan,"range1":lessThan, result : resultText}, id : typeId}
          const fromServer = await sendResult({text : resultTitle, type : "2column", results : []})

          if(fromServer.status == false){
            alert("Variable NOT added")
          }else{
            alert("Variable has been added")
           
          }
  
          
       }
       sendData()
    }else{
        alert("variable is empty")
    }

}
   const formatCondition = (idOfOption) => {

      if(lessThan!= '' && greaterThan != ''){
        const sendData = async () => {
            var body = {obj : {"range0":greaterThan,"range1":lessThan, result : resultText}, id : typeId}
            const fromServer = await sendCondition(body)
            if(fromServer.status == false){
              alert("Condition NOT added")
            }else{
              alert("Condition has been added")
             
            }
    
            
         }
         sendData()
      }else{
          alert("condition is empty")
      }

  }
    async function sendQuestion(body) {
        return fetch(serverAddress+'/addQuestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
          .then(data => data.json())
       }

       const formatToSend = () => {

          if(question != ''){
            const sendData = async () => {
                var body = {"question":question,"notes":notes}
                const fromServer = await sendQuestion(body)
                if(fromServer.status == false){
                  alert("Question NOT added")
                }else{
                  alert("Question has been added")
                  getData()
                }
        
                
             }
             sendData()
          }else{
              alert("question is empty")
          }
    
      }
    return (
      <div>
      <ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Add Questions</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Conditions</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Variables</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active container" id="home" role="tabpanel" aria-labelledby="home-tab"><AddQuestion formatToSend={formatToSend} setNotes = {setNotes} setQuestion={setQuestion} questions = {questions} deleteQuestion = {deleteQuestion}/></div>
  <div class="tab-pane fade container" id="profile" role="tabpanel" aria-labelledby="profile-tab"> <br />    <ol class="list-group list-group-numbered"> {results.map((option) => (<ResultType option={option}/>))}</ol><AddResultCondition results = {results} setTypeId = {setTypeId} setGreaterThan = {setGreaterThan} setLessThan = {setLessThan} setResultText = {setResultText} formatCondition = {formatCondition}/>
</div>
  <div class="tab-pane fade container" id="contact" role="tabpanel" aria-labelledby="contact-tab"><AddResult results = {results} setResultTitle = {setResultTitle} submitResult = {submitResult} deleteResult = {deleteResult} resultTitle = {resultTitle}/></div>
</div>
</div>
        
    )
}





const AddResult = ({results, setResultTitle, submitResult, deleteResult, resultTitle}) => {
  return(
    <div className="container">
    <form >
      
  <div class="mb-3">
    <label for="notes" class="form-label">Title</label>
    <textarea class="form-control" id="notes" rows="1" placeholder="Notes" onChange={(e)=>{setResultTitle(e.target.value)}}></textarea>
  </div>
  <button type="button" class="btn btn-primary btn-lg" onClick={submitResult}>Add Variable</button>

    </form>
    <br/>
    <h1>Questions</h1>
    <ul class="list-group">
    {results.map((result, index)=>  
(<ResultAndDelete result = {result}  index = {index} deleteResult = {deleteResult}/>))}
</ul>
</div>

  )
}
const AddQuestion = ({formatToSend,setNotes, setQuestion , questions, deleteQuestion}) => {
  return(
    <div className="container">
    <form onSubmit={formatToSend}>
              <div class="mb-3">
    <label for="question" class="form-label">Question</label>
    <textarea class="form-control" id="question" rows="3" placeholder="Question" onChange={(e)=>{setQuestion(e.target.value)}}></textarea>
  </div>
  <div class="mb-3">
    <label for="notes" class="form-label">Notes</label>
    <textarea class="form-control" id="notes" rows="1" placeholder="Notes" onChange={(e)=>{setNotes(e.target.value)}}></textarea>
  </div>
  <button type="button" class="btn btn-primary btn-lg" onClick={formatToSend}>Add Question</button>

    </form>
    <br/>
    <h1>Questions</h1>
    <ul class="list-group">
    {questions.map((question, index)=>  
(<QuestionAndDelete question = {question} deleteQuestion = {deleteQuestion} index = {index}/>))}
</ul>
</div>

  )
}
const ResultAndDelete = ({result, index, deleteResult}) => {
  return(
    <li class="list-group-item">{index}: {result.text} <a type="button" class="btn btn-danger text-left" style={{display : "left"}} onClick={()=>{deleteResult({id:result.id})}}>Delete Question</a>
    </li>

  )

}
const QuestionAndDelete = ({question, index, deleteQuestion}) => {
  return(
    <li class="list-group-item">{index}: {question.question} <a type="button" class="btn btn-danger text-left" style={{display : "left"}} onClick={()=>{deleteQuestion({id:question.id})}}>Delete Question</a>
    </li>

  )

}
  const AddResultCondition = ({results, setGreaterThan, setLessThan, setTypeId, setResultText, formatCondition}) => {
  return(

<form onSubmit={formatCondition}><br/>
  <h1 className="display-text">Add Condition</h1>
<select class="form-select" aria-label="Default select example" onChange={(e)=>{setTypeId(e.target.value)}}>
  {results.map((option)=> (  <option value={option.id}>{option.text}</option>))}

</select>
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Greater Than" aria-label="Username" onChange={(e)=>{setGreaterThan(e.target.value)}}/>
  <span class="input-group-text">Score</span>
  <input type="text" class="form-control" placeholder="Less Than" aria-label="Server" onChange={(e)=>{setLessThan(e.target.value)}}/>
</div>
<div class="input-group">
  <span class="input-group-text">Result</span>
  <textarea class="form-control" aria-label="With textarea" onChange={(e)=>{setResultText(e.target.value)}}></textarea>
</div>
<button class="btn btn-primary" type="submit" >Submit</button>

</form>


  )

}


const ResultType = ({option}) => {
  return(
    <div>
    
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">{option.text}</div>
      <div class="accordion" id="accordionExample">

      {option.results.map((range) => (<ConditionText range={range}/>))}
      </div>
    </div>
    <span class="badge bg-primary rounded-pill"></span>
  </li>
 

    </div>

  )
}
const ConditionText = ({range}) => {
  return(
<div class="accordion-item">
    <h2 class="accordion-header" id={range.id}>
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+range.id} aria-expanded="false" aria-controls={"#collapse"+range.id}>
      If between {range['range0']} and {range['range1']}
      </button>
    </h2>
    <div id={"collapse"+range.id} class="accordion-collapse collapse" aria-labelledby={range.id} data-bs-parent="#accordionExample">
      <div class="accordion-body">
       {range.result}
      </div>
    </div>
  </div>

  )
}
  


export default Admin
