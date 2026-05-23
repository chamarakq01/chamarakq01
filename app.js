function updateClock(){
 const now = new Date();

 document.getElementById('clock').innerHTML =
 now.toLocaleTimeString('en-GB',{
   hour12:false
 });
}

setInterval(updateClock,1000);
updateClock();

function addRound(){

 const input = document.getElementById('roundInput');

 const value = Number(input.value);

 if(!value || value < 1 || value > 18){
   alert('Enter value 1-18');
   return;
 }

 const prev = historyData[historyData.length-1]?.value || value;

 const delta = value-prev;

 historyData.push({
   value,
   delta,
   time:new Date().toLocaleTimeString()
 });

 if(historyData.length >= 2){
   updateTransition(prev,value);
 }

 updateDelta();
 updateSequenceMemory();
 saveHistory();
 renderHistory();
 renderPredictions();
 detectPatterns();

 input.value='';
}

function renderHistory(){

 const table = document.getElementById('historyTable');

 table.innerHTML='';

 historyData.slice().reverse().forEach((item,index)=>{

   const tr = document.createElement('tr');

   tr.innerHTML=`
   <td>${historyData.length-index}</td>
   <td>${item.value}</td>
   <td>${item.delta}</td>
   <td>${item.time}</td>
   `;

   table.appendChild(tr);
 });
}

function detectPatterns(){

 const patterns = document.getElementById('patterns');

 patterns.innerHTML='';

 if(historyData.length < 4) return;

 const a = historyData[historyData.length-4].value;
 const b = historyData[historyData.length-3].value;
 const c = historyData[historyData.length-2].value;
 const d = historyData[historyData.length-1].value;

 const d1 = b-a;
 const d2 = c-b;
 const d3 = d-c;

 if(d2===d1+1 && d3===d2+1){

   const next = d + (d3+1);

   patterns.innerHTML=`
   Delta Growth Pattern Detected<br>
   Expected Next: ${next}
   `;
 }
}

renderHistory();
renderPredictions();
