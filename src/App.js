import {useState, useEffect} from 'react';
import {PieChart, Pie} from 'recharts';
import Chart from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js";
import './App.css';

function App() {

  const [macros, setMacros] = useState([
    {name: 'carb', grams: 0},
    {name: 'fat', grams: 0},
    {name: 'protein', grams: 0}
  ]); // carb, fat, protein
  useEffect(()=>{
    console.log(macros);
  }, [macros]);

  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [proteins, setProteins] = useState(0);


  function addMeal(){
    setMacros([
      {name: 'carb', grams: macros[0].grams+Number(carbs)},
      {name: 'fat', grams: macros[1].grams+Number(fats)},
      {name: 'protein', grams: macros[2].grams+Number(proteins)}
    ]);
    setFats(0);
    setCarbs(0);
    setProteins(0);
  }

  function removeMeal(){
    setMacros([
      {name: 'carb', grams: macros[0].grams - Number(fats) >= 0 ? macros[0].grams - Number(carbs) : 0},
      {name: 'fat', grams: macros[1].grams - Number(fats) >= 0 ? macros[1].grams - Number(fats) : 0},
      {name: 'protein', grams: macros[2].grams - Number(fats) >= 0 ? macros[2].grams - Number(proteins) : 0}
    ]);

    setFats(0);
    setCarbs(0);
    setProteins(0);
  }

  return (<div className="App">

    <div>
      <div>
        <label> Fats: <input type='number' placeholder='0' min='0' value={fats} onInput={e=>setFats(e.target.value)} /> </label>
        <label> Carbs: <input type='number' placeholder='0' min='0' value={carbs} onInput={e=>setCarbs(e.target.value)} /> </label>
        <label> Proteins: <input type='number' placeholder='0' min='0' value={proteins} onInput={e=>setProteins(e.target.value)} /> </label>
      </div>
      <div>
        <button onClick={addMeal}> Add </button>
        <button onClick={removeMeal}> Remove </button>
      </div>
    </div>

    <div className='stats'>
      <div> Carbs: {macros[0].grams}g </div>
      <div> Fats: {macros[1].grams}g </div>
      <div> Proteins: {macros[2].grams}g </div>
      <div> Total Calorie Count: {macros[0].grams*4 + macros[1].grams*9 + macros[2].grams*4} </div>
      <div width={300} height={400}>

      </div>
    </div>

  </div>);
}

export default App;
