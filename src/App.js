import {useState, useEffect} from 'react';
import {PieChart, Pie} from 'recharts';
import './App.css';

const url = 'https://manny2384-s-workspace-ibotdr.us-west-2.xata.sh/db/macroappTable:main/tables/Macros/data';

const get_options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer xau_f6BIbPOzqk0fDNwXQy0YCnTBOXRDjgFV', 
    'Content-Type': 'application/json',
  }
};

const today = new Date().toISOString().split('T')[0].replaceAll('-', '_');

function App() {

  const [macros, setMacros] = useState([
    {labels: 'carb', grams: 0, fill:'#19324d'},
    {labels: 'fat', grams: 0, fill:'#FFDA83'},
    {labels: 'protein', grams: 0, fill:'rgb(82, 24, 24)'}
  ]); // carb, fat, protein
  useEffect(()=>{
    
    console.log(new Date().toISOString().split('T')[0].replaceAll('-','_'));

    // fetch data for today
    const dataFetch = async () => {
      const data = await fetch(`${url}/${today}`, get_options)
      .then((res) => {
        if(res.status !== 200){

          console.log("record not found");
          
          
          // create new record for today
          return fetch(`${url}/${today}?columns=id`,{
            method: 'POST',
            headers: get_options.headers,
            body: `{"fats":0.0,"protein":0.0,"carbs":0.0}`
          })
          .then(res => res.json())
          .then(jsonres => jsonres)
          .catch(err => {console.log(err); return null});
        }

        else return res.json()
      })
      .then(jsonres => {
        setMacros([
          {labels: 'carb', grams: jsonres.carbs, fill:'#19324d'},
          {labels: 'fat', grams: jsonres.fats, fill:'#FFDA83'},
          {labels: 'protein', grams: jsonres.protein, fill:'rgb(82, 24, 24)'}
        ]);
      })
      .catch(err => console.log(err));
    }

    
    dataFetch();

  }, []);

  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [proteins, setProteins] = useState(0);


  function addMeal(){
    setMacros([
      {labels: 'carb', grams: macros[0].grams+Number(carbs), fill:'#19324d'},
      {labels: 'fat', grams: macros[1].grams+Number(fats), fill:'#FFDA83'},
      {labels: 'protein', grams: macros[2].grams+Number(proteins), fill:'rgb(82, 24, 24)'}
    ]);
    setFats(0);
    setCarbs(0);
    setProteins(0);
  }

  function removeMeal(){
    setMacros([
      {labels: 'carb', grams: macros[0].grams - Number(fats) >= 0 ? macros[0].grams - Number(carbs) : 0, fill:'#19324d'},
      {labels: 'fat', grams: macros[1].grams - Number(fats) >= 0 ? macros[1].grams - Number(fats) : 0, fill:'#FFDA83'},
      {labels: 'protein', grams: macros[2].grams - Number(fats) >= 0 ? macros[2].grams - Number(proteins) : 0, fill:'rgb(82, 24, 24)'}
    ]);

    setFats(0);
    setCarbs(0);
    setProteins(0);
  }

  function logMacros(){
    // update record in db for today
    fetch(`${url}/${today}?columns=id`,{
      method: 'PATCH',
      headers: get_options.headers,
      body: `{"fats":${macros[1].grams},"protein":${macros[2].grams},"carbs":${macros[0].grams}}`
    })
    .then((res)=>{

      return res.json();
    }).then((resjson)=>{
      
      console.log(resjson);
    }).catch((err)=>{

      console.log(err);
    });


    
  }

  return (<div className="App flexColumn">

    <div>
      <div className='labels flexColumn'>
        <div>
          <label> Fats: <input type='number' placeholder='0' min='0' value={fats} onInput={e=>setFats(e.target.value)} /> </label>
        </div>

        <div>
          <label> Carbs: <input type='number' placeholder='0' min='0' value={carbs} onInput={e=>setCarbs(e.target.value)} /> </label>
        </div>

        <div>
          <label> Proteins: <input type='number' placeholder='0' min='0' value={proteins} onInput={e=>setProteins(e.target.value)} /> </label>
        </div>

      </div>
      <div className='flexRow'>
        <button onClick={addMeal}> Add </button>
        <button onClick={removeMeal}> Remove </button>
      </div>
    </div>

    <div className='stats flexColumn'>
      <div> Nutrition Summary </div>
      <div> Carbs: {macros[0].grams}g </div>
      <div> Fats: {macros[1].grams}g </div>
      <div> Proteins: {macros[2].grams}g </div>
      <div> Calories: {macros[0].grams*4 + macros[1].grams*9 + macros[2].grams*4} </div>
      <div> <button onClick={logMacros}> Log Macros </button> </div>
    </div>

    <PieChart width={200} height={200}>
      <Pie data={macros} dataKey='grams' outerRadius={80} fill='black' />
    </PieChart>

  </div>);
}

export default App;
