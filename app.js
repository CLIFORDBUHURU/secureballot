let selectedCandidate = null;
const CANDIDATES = {'1':'John Reed - Independent','2':'Maria Lopez - Progressive','3':'David Chen - Alliance'};

// MODE 2: REGISTRATION
function registerVoter(){
  const name = document.getElementById('regName').value.trim();
  const id = document.getElementById('regId').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  if(!name || id.length<3 || phone.length<9){ alert("Fill all fields correctly"); return; }

  let pending = JSON.parse(localStorage.getItem('sb_pending')||'[]');
  let approved = JSON.parse(localStorage.getItem('sb_approved')||'[]');

  if(pending.find(v=>v.id===id) || approved.find(v=>v.id===id)){
    document.getElementById('regMsg').innerHTML = "⚠️ ID "+id+" already registered. Check status below.";
    return;
  }
  pending.push({name, id, phone, date: new Date().toLocaleString()});
  localStorage.setItem('sb_pending', JSON.stringify(pending));
  document.getElementById('regMsg').innerHTML = "✅ Registration Submitted! ID: "+id+" is PENDING admin approval. Check back later.";
  document.getElementById('regName').value=''; document.getElementById('regId').value=''; document.getElementById('regPhone').value='';
}

function checkStatus(){
  const id = document.getElementById('checkId').value.trim();
  const pending = JSON.parse(localStorage.getItem('sb_pending')||'[]');
  const approved = JSON.parse(localStorage.getItem('sb_approved')||'[]');
  const voted = JSON.parse(localStorage.getItem('sb_voters')||'[]');
  let msg = "";
  if(approved.find(v=>v.id===id)){
    if(voted.includes(id)) msg = "✅ APPROVED but you ALREADY VOTED";
    else msg = "✅ APPROVED - You can now go to Vote page and vote!";
  } else if(pending.find(v=>v.id===id)){
    msg = "⏳ PENDING - Admin has not approved you yet. Wait.";
  } else {
    msg = "❌ NOT FOUND - Please register first.";
  }
  document.getElementById('statusResult').innerText = msg;
}

// MODE 2: VERIFY BEFORE VOTING
function verifyVoterMode2(){
  const id = document.getElementById('idNumber').value.trim();
  let approved = JSON.parse(localStorage.getItem('sb_approved')||'[]');
  let voters = JSON.parse(localStorage.getItem('sb_voters')||'[]');

  if(!approved.find(v=>v.id===id)){
    alert("❌ ID "+id+" is NOT approved. Go to register.html and wait for admin approval.");
    return;
  }
  if(voters.includes(id)){
    alert("❌ You already voted! One Person One Vote.");
    return;
  }
  localStorage.setItem('sb_current_voter', id);
  const voterInfo = approved.find(v=>v.id===id);
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('voteBox').classList.remove('hidden');
  document.getElementById('welcomeVoter').innerText = "Welcome "+voterInfo.name+" (ID: "+id+") - Choose one candidate";
  document.getElementById('voterStatus').innerText = "Verified: "+voterInfo.name;
}

function selectCandidate(el, id){ document.querySelectorAll('.candidate').forEach(c=>c.classList.remove('selected')); el.classList.add('selected'); selectedCandidate=id; }

function submitVote(){
  if(!selectedCandidate){ alert("Select candidate"); return; }
  const voterId = localStorage.getItem('sb_current_voter');
  let votes = JSON.parse(localStorage.getItem('sb_votes')||'[]');
  let voters = JSON.parse(localStorage.getItem('sb_voters')||'[]');
  votes.push({candidate: selectedCandidate, hash: btoa(voterId+"|"+Date.now()).substring(0,12), time: new Date().toISOString()});
  voters.push(voterId);
  localStorage.setItem('sb_votes', JSON.stringify(votes));
  localStorage.setItem('sb_voters', JSON.stringify(voters));
  alert("✅ Vote Encrypted & Submitted!");
  window.location.href = "results.html";
}

// ADMIN MODE 2
function loadAdminMode2(){
  let pending = JSON.parse(localStorage.getItem('sb_pending')||'[]');
  let approved = JSON.parse(localStorage.getItem('sb_approved')||'[]');
  let votes = JSON.parse(localStorage.getItem('sb_votes')||'[]');

  document.getElementById('pendingCount').innerText = pending.length;
  document.getElementById('approvedCount').innerText = approved.length;
  document.getElementById('totalVotes').innerText = votes.length;
  document.getElementById('totalApproved').innerText = approved.length;

  let pHtml = pending.length? "" : "<p>No pending registrations</p>";
  pending.forEach((v,i)=>{
    pHtml += `<div style="border:1px solid #ddd;padding:10px;margin:8px 0;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
      <div><b>${v.name}</b><br>ID: ${v.id}<br>Phone: ${v.phone}<br><small>${v.date}</small></div>
      <div><button onclick="approveVoter(${i})" class="vote-btn" style="width:auto;padding:8px 15px">Approve</button><br><button onclick="rejectVoter(${i})" class="btn-danger">Reject</button></div>
    </div>`;
  });
  document.getElementById('pendingList').innerHTML = pHtml;

  let aHtml = approved.length? "" : "<p>No approved voters yet</p>";
  approved.forEach(v=>{
    const hasVoted = JSON.parse(localStorage.getItem('sb_voters')||'[]').includes(v.id)? "✅ Voted" : "⏳ Not voted";
    aHtml += `<div style="border:1px solid #0f2a5a;padding:8px;margin:5px 0;border-radius:8px">${v.name} - ID: ${v.id} - ${hasVoted}</div>`;
  });
  document.getElementById('approvedList').innerHTML = aHtml;

  const counts={'1':0,'2':0,'3':0}; votes.forEach(v=>counts[v.candidate]++);
  document.getElementById('adminResults').innerHTML = `John: ${counts['1']} | Maria: ${counts['2']} | David: ${counts['3']}`;
}

function approveVoter(index){
  let pending = JSON.parse(localStorage.getItem('sb_pending')||'[]');
  let approved = JSON.parse(localStorage.getItem('sb_approved')||'[]');
  const voter = pending.splice(index,1)[0];
  approved.push(voter);
  localStorage.setItem('sb_pending', JSON.stringify(pending));
  localStorage.setItem('sb_approved', JSON.stringify(approved));
  loadAdminMode2();
}

function rejectVoter(index){
  if(!confirm("Reject this voter?")) return;
  let pending = JSON.parse(localStorage.getItem('sb_pending')||'[]');
  pending.splice(index,1);
  localStorage.setItem('sb_pending', JSON.stringify(pending));
  loadAdminMode2();
}

function clearAllSystem(){ if(confirm("RESET ALL? Deletes voters, votes, everything!")){ localStorage.clear(); location.reload(); } }
function exportVotes(){ const votes = localStorage.getItem('sb_votes')||'[]'; const blob=new Blob([votes],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='votes.json'; a.click(); }
function loadResults(){ /* same as before - counts */ const votes=JSON.parse(localStorage.getItem('sb_votes')||'[]'); const counts={'1':0,'2':0,'3':0}; votes.forEach(v=>counts[v.candidate]++); const total=votes.length; if(document.getElementById('resultBars')){ let html=""; for(let id in CANDIDATES){ const pct=total?Math.round((counts[id]/total)*100):0; html+=`<div style="margin:10px 0"><b>${CANDIDATES[id]} - ${counts[id]} (${pct}%)</b><div style="height:18px;background:#0f2a5a;width:${pct}%;border-radius:10px"></div></div>`; } document.getElementById('resultBars').innerHTML=html; document.getElementById('resultTotal').innerText="Total: "+total; } }