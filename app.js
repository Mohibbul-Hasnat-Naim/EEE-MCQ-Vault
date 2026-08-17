let bank=[];let answered=0;
async function loadBank(){const files=['ET_BJT.json'];const data=await Promise.all(files.map(f=>fetch('questions/'+f).then(r=>r.json())));bank=data.flat();render();}
function render(){const c=document.getElementById('content');c.innerHTML='';document.getElementById('progress').textContent=`${answered}/${bank.length} Completed`;
bank.forEach(q=>{const d=document.createElement('div');d.className='card';d.innerHTML=`<div><b>${q.id}</b></div><h3>${q.question}</h3>`;
Object.entries(q.options).forEach(([k,v])=>{const o=document.createElement('div');o.className='option';o.textContent=`${k}. ${v}`;o.onclick=()=>{if(d.dataset.locked)return;d.dataset.locked=1;answered++;document.getElementById('progress').textContent=`${answered}/${bank.length} Completed`;o.classList.add(k===q.correct?'correct':'wrong');if(k!==q.correct){[...d.querySelectorAll('.option')].find(x=>x.textContent.startsWith(q.correct+'.')).classList.add('correct');}
d.querySelector('.conf').classList.remove('hidden');};d.appendChild(o);});
d.innerHTML+=`<div class='conf hidden'><p><b>Confidence</b> (⭐–⭐⭐⭐⭐)</p><details><summary>Hint</summary>${q.hint}</details><details><summary>Explanation</summary>${q.explanation}</details></div>`;c.appendChild(d);});}
window.onload=loadBank;
