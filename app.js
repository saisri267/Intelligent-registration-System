const DATA = {
  "India": { code:"+91", states:{
    "Telangana":["Hyderabad","Warangal","Nizamabad"],
    "Karnataka":["Bengaluru","Mysuru","Mangalore"]
  }},
  "USA": { code:"+1", states:{
    "California":["San Francisco","Los Angeles","San Diego"],
    "Texas":["Houston","Dallas","Austin"]
  }},
  "UK": { code:"+44", states:{
    "England":["London","Manchester"],
    "Scotland":["Edinburgh","Glasgow"]
  }}
};

const DISPOSABLE_DOMAINS = ["tempmail.com","10minutemail.com","mailinator.com","guerrillamail.com"];
const COMMON_PW = ["password","123456","qwerty","admin","letmein","welcome"];
const MOCK_TAKEN_EMAILS = ["existing@example.com","student@frugal.com"];

const LS_KEY = "regform_v3_draft";

/*DOM SHORTCUTS  */
const $ = id => document.getElementById(id);
const form = $('regForm');

/* BASIC UTILITIES*/
function debounce(fn, delay=300){
  let timer; 
  return (...args)=>{ clearTimeout(timer); timer=setTimeout(()=>fn(...args), delay); };
}
function showError(id,msg){
  if($(`err-${id}`)) $(`err-${id}`).textContent = msg;
  if($(id)) $(id).classList.toggle('invalid', !!msg);
}
function clearErrors(){
  document.querySelectorAll('.error').forEach(e=>e.textContent="");
  document.querySelectorAll('.invalid').forEach(e=>e.classList.remove('invalid'));
  $('formMessage').style.display="none";
}
function elText(id,txt){ if($(id)) $(id).textContent = txt; }

/* DARK MODE */
function applyTheme(t){
  if(t==="dark"){
    document.documentElement.classList.add("dark");
    $('themeToggle').textContent = "☀️ Light Mode";
  } else {
    document.documentElement.classList.remove("dark");
    $('themeToggle').textContent = "🌙 Dark Mode";
  }
}
function initTheme(){
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark?"dark":"light");
  applyTheme(theme);
  $('themeToggle').onclick = ()=>{
    const curr = document.documentElement.classList.contains("dark")?"dark":"light";
    const next = curr==="dark"?"light":"dark";
    localStorage.setItem("theme",next);
    applyTheme(next);
  };
}

/* LOCATION POPULATION */
function populateCountries(){
  const c = $('country');
  Object.keys(DATA).forEach(k=>{
    const opt = document.createElement("option");
    opt.value=k; opt.textContent=k;
    c.appendChild(opt);
  });
}
function populateStates(country){
  $('state').innerHTML='<option value="">Select state</option>';
  $('city').innerHTML='<option value="">Select city</option>';
  if(!country || !DATA[country]) return;
  Object.keys(DATA[country].states).forEach(st=>{
    const opt=document.createElement("option");
    opt.value=st; opt.textContent=st;
    $('state').appendChild(opt);
  });
}
function populateCities(country,state){
  $('city').innerHTML='<option value="">Select city</option>';
  if(!country || !state) return;
  DATA[country].states[state].forEach(ct=>{
    const opt=document.createElement("option");
    opt.value=ct; opt.textContent=ct;
    $('city').appendChild(opt);
  });
}

/*  PHONE AUTO-FORMAT */
function formatPhone(raw){
  let s = raw.replace(/[^\d+]/g,'');
  if(!s.startsWith("+")) return s;
  const match = s.match(/^\+(\d{1,3})(.*)$/);
  if(!match) return s;
  const cc = "+"+match[1];
  const rest = match[2];
  if(rest.length > 8) return cc+" "+rest.replace(/(\d{5})(\d+)/,"$1 $2");
  if(rest.length > 5) return cc+" "+rest.replace(/(\d{3})(\d+)/,"$1 $2");
  return cc+" "+rest;
}

/* EMAIL INTELLIGENCE */
async function checkEmailReputation(email){
  if(!email.includes("@")){ elText("emailHint",""); return; }
  const domain = email.split("@")[1].toLowerCase();
  if(DISPOSABLE_DOMAINS.includes(domain)){
    elText("emailHint","Disposable email detected.");
    return;
  }
  elText("emailHint","Checking email reputation...");
  try{
    const res = await fetch(`https://emailrep.io/${email}`);
    if(!res.ok){ elText("emailHint","Reputation check unavailable."); return; }
    const data = await res.json();
    elText("emailHint",`Reputation: ${data.reputation || "unknown"}`);
  }catch{
    elText("emailHint","Reputation check unavailable.");
  }
}

function mockEmailAvailability(email){
  return new Promise(res=>{
    setTimeout(()=>{
      res({taken: MOCK_TAKEN_EMAILS.includes(email.toLowerCase())});
    },700);
  });
}

/* PASSWORD STRENGTH + CRACK TIME */
function scorePassword(pwd){
  if(!pwd) return 0;
  let score = 0;
  if(pwd.length>=8) score++;
  if(pwd.length>=12) score++;
  if(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if(/\d/.test(pwd)) score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;
  const l = pwd.toLowerCase();
  COMMON_PW.forEach(w=>{ if(l.includes(w)) score-=2; });
  if(/(.)\1\1/.test(pwd)) score--;
  return Math.max(0,Math.min(score,10));
}
function estimateCrack(pwd){
  if(!pwd) return "Instant";
  let pool = 0;
  if(/[a-z]/.test(pwd)) pool+=26;
  if(/[A-Z]/.test(pwd)) pool+=26;
  if(/\d/.test(pwd)) pool+=10;
  if(/[^A-Za-z0-9]/.test(pwd)) pool+=32;
  if(pool===0) return "Instant";
  const combos = Math.pow(pool,pwd.length);
  const sec = combos / 1e9;
  if(sec<60) return `${Math.round(sec)} sec`;
  const min = sec/60;
  if(min<60) return `${Math.round(min)} min`;
  const h=min/60;
  if(h<24) return `${Math.round(h)} hrs`;
  const d=h/24;
  if(d<365) return `${Math.round(d)} days`;
  const y=d/365;
  return `${Math.round(y)} years`;
}

function updatePwdStrength(){
  const pwd = $('password').value;
  const s = scorePassword(pwd);
  $('pwdMeter').value=s;
  let msg="";
  if(s<=2) msg="Weak";
  else if(s<=4) msg="Medium";
  else if(s<=7) msg="Strong";
  else msg="Very Strong";
  msg += ` • Crack: ${estimateCrack(pwd)}`;
  $('pwdStrength').textContent = msg;
}

/*  VALIDATION ENGINE */
function validateFields(show=true){
  clearErrors();
  let ok = true;

  const reqText = [
    "firstName","lastName","email","phone",
    "country","state","city"
  ];
  reqText.forEach(id=>{
    if(!$(id).value.trim()){
      if(show) showError(id,`${id} is required`);
      ok=false;
    }
  });

  const email = $('email').value.trim();
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    if(show) showError("email","Invalid email");
    ok=false;
  }

  const pwd = $('password').value.trim();
  const cpwd = $('confirmPassword').value.trim();
  if(pwd.length < 6){ if(show) showError("password","Minimum 6 chars"); ok=false; }
  if(!cpwd){ if(show) showError("confirmPassword","Confirm password"); ok=false;}
  else if(pwd!==cpwd){ if(show) showError("confirmPassword","Passwords mismatch"); ok=false; }

  if(!document.querySelector('input[name="gender"]:checked')){
    if(show) showError("gender","Select gender");
    ok=false;
  }

  if(!$('terms').checked){
    if(show) showError("terms","Accept terms");
    ok=false;
  }

  return ok;
}

/* AUTOSAVE & RESTORE */
function saveDraft(){
  const d = {
    firstName:$('firstName').value,
    lastName:$('lastName').value,
    email:$('email').value,
    phone:$('phone').value,
    age:$('age').value,
    gender:(document.querySelector('input[name="gender"]:checked')||{}).value||"",
    address:$('address').value,
    country:$('country').value,
    state:$('state').value,
    city:$('city').value
  };
  localStorage.setItem(LS_KEY,JSON.stringify(d));
  updateProgress();
}
const saveDebounced = debounce(saveDraft,400);

function restoreDraft(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw) return;
  const d=JSON.parse(raw);
  $('firstName').value=d.firstName||"";
  $('lastName').value=d.lastName||"";
  $('email').value=d.email||"";
  $('phone').value=d.phone||"";
  $('age').value=d.age||"";
  $('address').value=d.address||"";

  if(d.gender){
    const g=document.querySelector(`input[name="gender"][value="${d.gender}"]`);
    if(g) g.checked=true;
  }

  if(d.country){
    $('country').value=d.country;
    populateStates(d.country);
  }
  if(d.state){
    $('state').value=d.state;
    populateCities(d.country,d.state);
  }
  if(d.city) $('city').value=d.city;

  updatePwdStrength();
}

/* IP AUTO-FILL */
async function autofillLocation(){
  try{
    const res=await fetch("https://ipapi.co/json");
    if(!res.ok) return;
    const j=await res.json();
    const matchCountry = Object.keys(DATA).find(k =>
      k.toLowerCase() === (j.country_name||"").toLowerCase()
    );
    if(matchCountry){
      $('country').value = matchCountry;
      populateStates(matchCountry);
      if(j.region && DATA[matchCountry].states[j.region]){
        $('state').value=j.region;
        populateCities(matchCountry,j.region);
        if(j.city) $('city').value=j.city;
      }
    }
  }catch{}
}

/* SUMMARY MODAL */
function buildSummary(){
  const f = (id)=>$(id).value || "<i>none</i>";
  return `
  <dl class="summary-body">
    <dt>First Name</dt><dd>${f("firstName")}</dd>
    <dt>Last Name</dt><dd>${f("lastName")}</dd>
    <dt>Email</dt><dd>${f("email")}</dd>
    <dt>Phone</dt><dd>${f("phone")}</dd>
    <dt>Age</dt><dd>${f("age")}</dd>
    <dt>Gender</dt><dd>${(document.querySelector('input[name="gender"]:checked')||{}).value||"<i>none</i>"}</dd>
    <dt>Address</dt><dd>${f("address")}</dd>
    <dt>Country</dt><dd>${f("country")}</dd>
    <dt>State</dt><dd>${f("state")}</dd>
    <dt>City</dt><dd>${f("city")}</dd>
  </dl>
  `;
}
function openModal(){
  $('summaryBody').innerHTML = buildSummary();
  $('summaryModal').setAttribute("aria-hidden","false");
}
function closeModal(){
  $('summaryModal').setAttribute("aria-hidden","true");
}

/*  PROGRESS BAR */
function updateProgress(){
  const fields = ["firstName","lastName","email","phone","country","state","city","password","confirmPassword"];
  let filled = 0;
  fields.forEach(id=>{
    if($(id) && $(id).value.trim()) filled++;
  });
  const pct = Math.round((filled / fields.length)*100);
  $('progressBar').style.width = pct+"%";
  $('progressBar').setAttribute("aria-valuenow",pct);
}

/* VOICE INPUT */
let recognition;
function initVoice(){
  const btn = $('voiceBtn');
  if(!window.webkitSpeechRecognition){ btn.style.display="none"; return;}
  const Speech = window.webkitSpeechRecognition;
  recognition = new Speech();
  recognition.lang="en-IN";
  recognition.onresult=e=>{
    const text=e.results[0][0].transcript.toLowerCase();
    if(text.includes("first name")) $('firstName').value = text.split("first name")[1].trim();
    if(text.includes("last name"))  $('lastName').value = text.split("last name")[1].trim();
    if(text.includes("email")) $('email').value = text.replace(/\s/g,"").replace("email","").replace("at","@").replace("dot",".");
    if(text.includes("phone")) $('phone').value = text.replace(/[^\d+]/g,"");
    saveDebounced(); updateProgress();
  };
  btn.onclick=()=>recognition.start();
}

/* CONFETTI */
function launchConfetti(){
  const canvas = $('confettiCanvas');
  const ctx = canvas.getContext("2d");
  canvas.style.display="block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors=["#ff595e","#ffca3a","#8ac926","#1982c4","#6a4c93"];
  const parts=[];
  for(let i=0;i<100;i++){
    parts.push({
      x:Math.random()*canvas.width,
      y:Math.random()* canvas.height - canvas.height,
      vx:(Math.random()-0.5)*6,
      vy:Math.random()*6+3,
      size:Math.random()*7+4,
      color:colors[Math.floor(Math.random()*colors.length)]
    });
  }

  let t=0;
  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    t++;
    if(t<120) requestAnimationFrame(frame);
    else canvas.style.display="none";
  }
  frame();
}

/*SUPER RESET */
function superReset(){
  form.reset();
  clearErrors();
  $('pwdMeter').value=0;
  $('pwdStrength').textContent="";
  $('emailHint').textContent="";
  $('progressBar').style.width="0%";

  try{
    localStorage.removeItem(LS_KEY);
  }catch{}

  closeModal();
}

/* MAIN ONLOAD LOGIC */
document.addEventListener("DOMContentLoaded",()=>{

  initTheme();
  populateCountries();
  restoreDraft();
  autofillLocation();
  initVoice();
  updateProgress();

  /*  Cascading selects  */
  $('country').addEventListener("change",e=>{
    populateStates(e.target.value);
    updateProgress(); saveDebounced();
  });
  $('state').addEventListener("change",e=>{
    populateCities($('country').value,e.target.value);
    updateProgress(); saveDebounced();
  });
  $('city').addEventListener("change",()=>{ updateProgress(); saveDebounced(); });

  /* Inputs watcher */
  const watch = ["firstName","lastName","email","phone","password","confirmPassword","age","address"];
  watch.forEach(id=>{
    $(id).addEventListener("input",debounce(()=>{
      if(id==="phone") $('phone').value = formatPhone($('phone').value);
      if(id==="password") updatePwdStrength();
      validateFields(false);
      updateProgress();
      saveDebounced();
    },300));
  });

  /*  Email reputation */
  $('email').addEventListener("input", debounce(()=>{
    checkEmailReputation($('email').value.trim());
  },500));

  /* Email availability  */
  $('checkEmailBtn').addEventListener("click",async()=>{
    const email=$('email').value.trim();
    if(!email){ elText("emailHint","Enter email to check"); return;}
    elText("emailHint","Checking availability...");
    const r = await mockEmailAvailability(email);
    if(r.taken){ elText("emailHint","✗ Email already registered"); showError("email","Email already exists"); }
    else{ elText("emailHint","✓ Email available"); showError("email",""); }
  });

  /* Modal preview  */
  $('previewBtn').addEventListener("click",()=>{
    const ok = validateFields(false);
    openModal();
    if(!ok){ setTimeout(()=>validateFields(true),200); }
  });
  $('editBtn').addEventListener("click",closeModal);
  $('modalClose').addEventListener("click",closeModal);

  $('confirmSubmitBtn').addEventListener("click",()=>{
    closeModal();
    form.dispatchEvent(new Event("submit",{cancelable:true}));
  });

  /*  Final Submit  */
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!validateFields(true)){
      $('formMessage').textContent="Fix errors before submitting.";
      $('formMessage').style.display="block";
      $('formMessage').className="form-message error";
      return;
    }

    $('formMessage').textContent="Registration successful!";
    $('formMessage').className="form-message success";
    $('formMessage').style.display="block";

    launchConfetti();
    setTimeout(()=>superReset(),900);
  });

  /*  Reset button  */
  $('resetBtn').addEventListener("click",superReset);

  /*  Clear saved draft  */
  $('clearSaved').addEventListener("click",()=>{
    localStorage.removeItem(LS_KEY);
    alert("Draft cleared");
  });

});
