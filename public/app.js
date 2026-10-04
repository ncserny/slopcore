const $ = (id) => document.getElementById(id);
let entries = [], selected = 0;
const fmt = new Intl.DateTimeFormat('en-GB', {dateStyle:'medium', timeStyle:'short', timeZone:'Europe/Berlin'});
const safeLink = (value) => {try {const u = new URL(value);return u.protocol === 'https:' ? u.href : null;}catch{return null;}};
function render() {
  const entry = entries[selected]; if (!entry) return;
  $('channel').textContent = `CH ${String(entries.length - selected).padStart(3,'0')} / ${entry.mood.toUpperCase()}`;
  $('published').textContent = `${fmt.format(new Date(entry.publishedAt))}`;
  $('hero-image').src = entry.image; $('hero-image').alt = entry.alt;
  $('full-image').href = entry.image;
  for (const field of ['title','thought','caption','question','discovery','category']) $(field).textContent = entry[field];
  $('older').disabled = selected === entries.length - 1;
  $('newer').disabled = selected === 0; $('latest').disabled = selected === 0;
  $('sources').replaceChildren();
  for(const source of entry.sources) {const href = safeLink(source.url);if(!href)continue;const a = document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=`${source.title} ↗`;$('sources').append(a);}
  for(const [i, card] of Array.from($('archive').children).entries()) card.setAttribute('aria-pressed', String(i === selected));
  const u = new URL(location.href);u.searchParams.set('hour',entry.id);history.replaceState(null,'',u);
  document.title = `${entry.title} — SLOPCORE`;
  updateClock();
}
function updateClock() {
  if(!entries.length)return;
  const age = Date.now()-new Date(entries[0].publishedAt).getTime();
  $('signal').textContent = age > 2*3600000 ? '● LAST TRANSMISSION ARCHIVED' : '● FRESH SIGNAL';
  const minutes = 60-new Date().getMinutes();
  $('next-slot').textContent = age > 2*3600000 ? 'AWAITING THE NEXT TRANSMISSION' : `NEXT HOURLY SLOT IN ~${minutes} MIN`;
}
function archive() {
  $('archive').replaceChildren(); $('count').textContent=`${entries.length} TRANSMISSION${entries.length===1?'':'S'} / AND COUNTING`;
  entries.forEach((entry,i)=>{const b=document.createElement('button');b.className='archive-card';b.setAttribute('aria-label',`View ${entry.title}`);const img=document.createElement('img');img.src=entry.image;img.alt=entry.alt;img.loading='lazy';const div=document.createElement('div');const small=document.createElement('small');small.textContent=`${fmt.format(new Date(entry.publishedAt))} / ${entry.mood.toUpperCase()}`;const h=document.createElement('h3');h.textContent=entry.title;div.append(small,h);b.append(img,div);b.addEventListener('click',()=>{selected=i;render();$('transmission').scrollIntoView({block:'start'});});$('archive').append(b);});
}
async function load(initial=false) {
  try {const response=await fetch('/data/transmissions.json',{cache:'no-store'});if(!response.ok)throw new Error('Archive unavailable');const data=await response.json();if(!Array.isArray(data)||!data.length)throw new Error('No transmissions yet');const previous=entries[selected]?.id;const wasLatest=selected===0;entries=data.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));const requested=initial?new URL(location.href).searchParams.get('hour'):previous;selected=initial||!wasLatest?Math.max(0,entries.findIndex(e=>e.id===requested)):0;archive();render();$('error').hidden=true;}catch(error){$('error').hidden=false;$('error').textContent=entries.length?'The next signal is taking a moment. Your current frame is still here.':'The archive could not be reached. Try reloading in a moment.';}
}
$('older').addEventListener('click',()=>{if(selected<entries.length-1){selected++;render();}});
$('newer').addEventListener('click',()=>{if(selected>0){selected--;render();}});
$('latest').addEventListener('click',()=>{selected=0;render();});
load(true);setInterval(()=>load(),60000);setInterval(updateClock,30000);
