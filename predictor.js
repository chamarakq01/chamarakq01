function generatePredictions(){

 let scores = {};

 for(let i=1;i<=18;i++){
   scores[i]=0;
 }

 const last = historyData[historyData.length-1]?.value;

 const transitions = getTransitionProbability(last);

 transitions.forEach(t=>{
   scores[t.number]+=t.probability*aiWeights.transition;
 });

 const sequences = predictFromSequence();

 sequences.forEach(s=>{
   scores[s.number]+=s.count*aiWeights.sequence;
 });

 for(let i=1;i<=18;i++){
   scores[i]+=centerWeight(i)*aiWeights.center;
   scores[i]+=repeatWeight(i)*aiWeights.repeat;
 }

 const ranked = Object.entries(scores)
 .map(([n,s])=>({
   number:Number(n),
   score:s
 }))
 .sort((a,b)=>b.score-a.score);

 return ranked.slice(0,7);
}

function renderPredictions(){
 const predictions = generatePredictions();

 const box = document.getElementById('predictions');

 box.innerHTML='';

 predictions.forEach((p,index)=>{

   const div = document.createElement('div');
   div.className='predictionItem';

   div.innerHTML=`
   #${index+1} → ${p.number}
   <br>
   Score: ${p.score.toFixed(2)}
   `;

   box.appendChild(div);
 });
}
