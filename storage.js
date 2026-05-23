let historyData = JSON.parse(localStorage.getItem('sicboHistory')) || [];

function saveHistory(){
 localStorage.setItem('sicboHistory', JSON.stringify(historyData));
}
