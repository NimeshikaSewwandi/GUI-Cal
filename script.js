const screen=document.querySelector("#screen");
const history=document.querySelector("#history");
const keys=document.querySelector("#keys");
const themeToggle=document.querySelector("#theme-toggle");
let current="0", previous=null, operator=null, waitingForNext=false, expression="";
function render(){screen.textContent=current;history.textContent=expression;}
function inputNumber(n){if(current==="Error"||current==="Cannot divide by zero"||waitingForNext){current=n;waitingForNext=false;}else{current=current==="0"?n:current+n;}render();}
function inputDecimal(){if(current==="Error"||waitingForNext){current="0.";waitingForNext=false;}else if(!current.includes(".")){current+=".";}render();}
function calculate(a,b,op){switch(op){case "+":return a+b;case "-":return a-b;case "*":return a*b;case "/":return b===0?null:a/b;default:return b;}}
function formatResult(n){return Number.isFinite(n)?String(Number(n.toPrecision(10))):"Error";}
function symbol(op){return ({"+":"+","-":"−","*":"×","/":"÷"})[op]||op;}
function chooseOperator(next){const value=Number(current);if(operator&& !waitingForNext){const result=calculate(previous,value,operator);if(result===null){current="Cannot divide by zero";previous=null;operator=null;waitingForNext=true;expression="";render();return;}current=formatResult(result);previous=Number(current);}else{previous=value;}operator=next;expression=`${current} ${symbol(next)}`;waitingForNext=true;render();}
function equals(){if(operator===null||previous===null||waitingForNext)return;const second=Number(current), old=`${formatResult(previous)} ${symbol(operator)} ${current} =`,result=calculate(previous,second,operator);current=result===null?"Cannot divide by zero":formatResult(result);expression=old;previous=null;operator=null;waitingForNext=true;render();}
function clearAll(){current="0";previous=null;operator=null;waitingForNext=false;expression="";render();}
function deleteLast(){if(waitingForNext||current==="Error"||current==="Cannot divide by zero"){current="0";waitingForNext=false;}else{current=current.length>1?current.slice(0,-1):"0";if(current==="-")current="0";}render();}
function toggleSign(){if(current!=="0"&&current!=="Error"&&!current.startsWith("Cannot"))current=current.startsWith("-")?current.slice(1):"-"+current;render();}
function percent(){const n=Number(current);if(Number.isFinite(n))current=formatResult(n/100);render();}
keys.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.number!==undefined)inputNumber(b.dataset.number);else if(b.dataset.operator)chooseOperator(b.dataset.operator);else switch(b.dataset.action){case "clear":clearAll();break;case "delete":deleteLast();break;case "sign":toggleSign();break;case "decimal":inputDecimal();break;case "percent":percent();break;case "equals":equals();break;}});
document.addEventListener("keydown",e=>{if(/^[0-9]$/.test(e.key))inputNumber(e.key);else if(e.key===".")inputDecimal();else if(["+","-","*","/"].includes(e.key))chooseOperator(e.key);else if(e.key==="Enter"||e.key==="="){e.preventDefault();equals();}else if(e.key==="Backspace")deleteLast();else if(e.key==="Escape")clearAll();});
themeToggle.addEventListener("click",()=>{document.body.classList.toggle("light");themeToggle.setAttribute("aria-label",document.body.classList.contains("light")?"Switch to dark theme":"Switch to light theme");});
render();
