import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg'
import Header from './Components/Header/Header'
import Questions from './Components/Questions/Questions'
import Admin from './Containers/Admin/Admin'
import React, { useState, useEffect } from 'react';
import useToken from './Components/useToken';
import { BrowserRouter, Route, Switch, useLocation} from 'react-router-dom';
import Login from './Containers/Login/Login'
function App() {
  const serverAddress = "http://localhost:8080"
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState([])
  const [responses, setResponses] = useState({})
  const { token, setToken } = useToken();

  async function getQuestions() {
    return fetch(serverAddress+'/getQuestions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
   }
   async function getResults() {
    return fetch(serverAddress+'/getResults', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
   }
   
  useEffect(() =>{

      const getData = async () => {
        const fromServer = await getQuestions()
        setQuestions(fromServer)
        const fromServer2 = await getResults()
        console.log('SET RESULTS')
        setResults(fromServer2)
        
     }
     getData()
    
    
    
  }, [])
  useEffect(() =>{
    if(results[0]){
      var responses = {}

      //For each result (variable, this way we can have infinite)
      for(var i=0;i<results.length;i++){
        responses[results[i].id] = {}


      }
      setResponses(responses)

    }
  
  
  
}, [results ])

  useEffect(() => {
    setQuestions([{question : "Hi this iswbw[eIFBU;skfjbsLJKfbLASKFblASKBfkjaSbaksbfAKSFbaskjfbaksjfbaklsjfblASKj clsajk jklkjf baskjb] the question", id : "id1" ,notes: "Just some subnotes about the question"},{question : "this one is a short one", id: "id2", notes: "This is bareley a question"},{question : "This is another question that is cool", id:'id3', notes : ''}])

  }, []);


  if(!token) {
    return (
      <div>
      <Header logo = { logo } token = {undefined}></Header>
      <br />
         <BrowserRouter>
        <Switch>
      <Route exact path="/" >
      <Questions questions = {questions} responses ={responses} setResponses = {setResponses} token={ token } results = {results} setResults= {setResults} serverAddress = {serverAddress}/>

      </Route>
      <Route >
      <Login setToken={setToken} serverAddress = {serverAddress}/>
        </Route>
      </Switch>
      </BrowserRouter></div>)
  }
  return (
    <div>
      <Header logo = {logo} />
      <br />

      <BrowserRouter >
        <Switch>
        <Route exact path="/" >
        <Questions questions = {questions} responses ={responses} setResponses = {setResponses}  results = {results} setResults= {setResults} serverAddress = {serverAddress}/>


        </Route>
          <Route path="/quiz">
          <Questions questions = {questions} responses ={responses} setResponses = {setResponses} results = {results} setResults= {setResults} serverAddress = {serverAddress}/>
          </Route>
          <Route path="/admin">
            <Admin results = {results} questions = {questions} setQuestions={setQuestions} serverAddress = {serverAddress}/>
          </Route>
         
        
          <Route >
            <h1>Not found</h1>
            </Route>

         
        </Switch>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
