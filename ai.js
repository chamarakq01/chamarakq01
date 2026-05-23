const transitionMatrix = {};
const sequenceMemory = {};
const deltaHistory = [];

const aiWeights = {
 transition:5,
 sequence:6,
 center:4,
 repeat:3,
 delta:5
};

function updateTransition(prev,next){
 if(!transitionMatrix[prev]){
   transitionMatrix[prev]={};
 }

 if(!transitionMatrix[prev][next]){
   transitionMatrix[prev][next]=0;
 }

 transitionMatrix[prev][next]++;
}

function updateSequenceMemory(){
 if(historyData.length < 4) return;

 const a = historyData[historyData.length-4].value;
 const b = historyData[historyData.length-3].value;
 const c = historyData[historyData.length-2].value;
 const next = historyData[historyData.length-1].value;

 const key = `${a},${b},${c}`;

 if(!sequenceMemory[key]){
   sequenceMemory[key]={};
 }

 if(!sequenceMemory[key][next]){
   sequenceMemory[key][next]=0;
 }

 sequenceMemory[key][next]++;
}

function updateDelta(){
 if(historyData.length < 2) return;

 const last = historyData[historyData.length-1].value;
 const prev = historyData[historyData.length-2].value;

 deltaHistory.push(last-prev);
}

function centerWeight(num){
 const center = 10.5;
 return Math.max(0,10-Math.abs(num-center));
}

function repeatWeight(num){
 const last = historyData[historyData.length-1]?.value;
 return last===num ? 5 : 0;
}

function getTransitionProbability(current){
 const row = transitionMatrix[current] || {};
 const total = Object.values(row).reduce((a,b)=>a+b,0);

 let result=[];

 for(let key in row){
   result.push({
     number:Number(key),
     probability:(row[key]/total)*100
   });
 }

 return result.sort((a,b)=>b.probability-a.probability);
}

function predictFromSequence(){
 if(historyData.length < 3) return [];

 const a = historyData[historyData.length-3].value;
 const b = historyData[historyData.length-2].value;
 const c = historyData[historyData.length-1].value;

 const key = `${a},${b},${c}`;

 const matches = sequenceMemory[key] || {};

 return Object.entries(matches)
 .map(([num,count])=>({
   number:Number(num),
   count
 }))
 .sort((a,b)=>b.count-a.count);
}
