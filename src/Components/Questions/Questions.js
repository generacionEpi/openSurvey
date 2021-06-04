import Header from './Header'
import Question from './Question/Question'
import React, { useState, useEffect } from 'react';

const Questions = ({questions, responses, setResponses, results, setResults, serverAddress}) => {
    console.log("This is the respone obj",responses)
    const [values, setValues] = useState({})
    const [clientEmail, setClientEmail] = useState('')


      useEffect(() => {
      
          if(results[0]){
            var valuesAll = {}
            for(var i=0;i<results.length;i++){
              valuesAll[results[i].id] = 0
      
      
            }
            
            setValues(valuesAll)

          }
      }, [ results ]);
    function updateResponse(value, id, responseNum){
        var tempResponses = responses
        tempResponses[responseNum][id] = value
        setResponses(tempResponses)
    }
    const updateValues = () => {
        console.log('updating values')
        var responceObj = responses
        var valueObj = values
        //Set all values to 0
        
        //valueObj[results[0].id] = 0
        //valueObj[results[1].id] = 0
        var allIds = Object.keys(responceObj[results[0].id])
        var total = allIds.length
        //For each question
        for(var i=0;i<allIds.length;i++){
          //For each variable (options)
          for(var x=0;x<results.length;x++){
            //Append value
            valueObj[results[x].id] = valueObj[results[x].id] + parseInt(responceObj[results[x].id][allIds[i]])
    
    
          }
            
        }  
        //Convert to percentage
        for(var x=0;x<results.length;x++){
   
          valueObj[results[x].id] = valueObj[results[x].id]/(total*10)
  
  
        }
        

        setValues(valueObj)
        valueObj.email = clientEmail
        const fromServer = submitResults(valueObj)
        alert("Thank you! Your results will be sent to your email")     
    }
    async function submitResults(body) {
        return fetch(serverAddress+'/submitResults', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(body)
        })
          .then(data => data.json())
       }
       


    return (
        <div className="container">
            
            <br/>
            <Header results = {results}/>
            <form class="row g-3" onSubmit={updateValues}>


            {questions.map((info)=>(<Question info = {info} updateResponse = {updateResponse} results = {results}/>))}

            
            <div class="d-grid gap-2">
                <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Email address</label>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"  onChange={(e)=>{setClientEmail(e.target.value)}} required/>
</div>

            <button class="btn btn-primary" type="submit" >Submit</button>
            </div>
            </form>
        </div>
    )
}

export default Questions
