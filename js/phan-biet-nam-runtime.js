const GBIF_API = "https://api.gbif.org/v1/species/search";
const GBIF_KINGDOM_KEY = 5;
const GBIF_PAGE_SIZE = 1000;
const MAX_GBIF_OFFSET = 99000;
const TARGET_SPECIES = 155000;
const TAXONOMY_CACHE_KEY = "myco-gbif-v155k";
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
const PAGE_SIZE = 10;

const seedMushrooms = [
  {id:"pleurotus-ostreatus",name:"Nấm bào ngư",scientific:"Pleurotus ostreatus",type:"edible",status:"Thực phẩm khi xác định đúng loài và nguồn nuôi trồng",level:"Chưa đánh giá mẫu hoang dã",note:"Nấm ăn phổ biến, thường được nuôi trồng.",toxin:"Không dùng hồ sơ này để nhận dạng mẫu hoang dã.",warning:"Chỉ sử dụng sản phẩm có nguồn gốc đáng tin cậy."},
  {id:"agaricus-bisporus",name:"Nấm mỡ",scientific:"Agaricus bisporus",type:"edible",status:"Thực phẩm khi xác định đúng loài và nguồn nuôi trồng",level:"Chưa đánh giá mẫu hoang dã",note:"Nấm ăn phổ biến được nuôi trồng.",toxin:"Không dùng hồ sơ này để nhận dạng mẫu hoang dã.",warning:"Chỉ sử dụng sản phẩm có nguồn gốc đáng tin cậy."},
  {id:"lentinula-edodes",name:"Nấm hương",scientific:"Lentinula edodes",type:"edible",status:"Thực phẩm khi xác định đúng loài và nguồn phù hợp",level:"Chưa đánh giá mẫu hoang dã",note:"Nấm hương được sử dụng làm thực phẩm.",toxin:"Không dùng hồ sơ này để nhận dạng mẫu hoang dã.",warning:"Chỉ sử dụng sản phẩm có nguồn gốc đáng tin cậy."},
  {id:"amanita-phalloides",name:"Nấm tử thần",scientific:"Amanita phalloides",type:"toxic",status:"ĐỘC — nguy cơ rất cao",level:"Rất cao",note:"Loài nấm độc có thể gây ngộ độc nghiêm trọng.",toxin:"Có amatoxin gây tổn thương gan và các cơ quan khác.",warning:"Không ăn. Nấu chín không loại bỏ được độc tố."},
  {id:"amanita-virosa",name:"Nấm thiên thần hủy diệt",scientific:"Amanita virosa",type:"toxic",status:"ĐỘC — nguy cơ rất cao",level:"Rất cao",note:"Loài nấm độc có thể gây ngộ độc nghiêm trọng.",toxin:"Có thể gây hội chứng ngộ độc nặng.",warning:"Không ăn hoặc thử nghiệm mẫu hoang dã."},
  {id:"amanita-verna",name:"Nấm thiên thần mùa xuân",scientific:"Amanita verna",type:"toxic",status:"ĐỘC — nguy cơ rất cao",level:"Rất cao",note:"Loài nấm độc có thể gây ngộ độc nghiêm trọng.",toxin:"Có thể gây hội chứng ngộ độc nặng.",warning:"Không ăn hoặc thử nghiệm mẫu hoang dã."},
  {id:"amanita-muscaria",name:"Nấm ruồi",scientific:"Amanita muscaria",type:"toxic",status:"ĐỘC / có hoạt chất ảnh hưởng thần kinh",level:"Cao",note:"Có hoạt chất ảnh hưởng hệ thần kinh.",toxin:"Có thể gây rối loạn thần kinh và tiêu hóa.",warning:"Không sử dụng hoặc tự thử nghiệm."},
  {id:"galerina-marginata",name:"Nấm Galerina viền",scientific:"Galerina marginata",type:"toxic",status:"ĐỘC — nguy cơ rất cao",level:"Rất cao",note:"Loài nấm độc có thể gây ngộ độc nghiêm trọng.",toxin:"Có amatoxin gây tổn thương gan.",warning:"Không ăn hoặc thử nghiệm mẫu hoang dã."}
].map(record=>({
  ...record,
  icon:record.type==="toxic"?"☠️":"🍄",
  habitat:"Thông tin sinh cảnh thay đổi theo khu vực; cần tài liệu định loại đáng tin cậy.",
  features:"Không thể xác định loài chỉ bằng màu sắc, hình dáng hoặc một ảnh.",
  uses:"Chưa có dữ liệu sử dụng đáng tin cậy.",
  effects:record.toxin,
  certainty:"Hồ sơ tham khảo; không dùng để quyết định ăn nấm hoang dã.",
  taxonomy:""
}));

const commercialEdibleMushrooms = [
  {id:"pleurotus-pulmonarius",name:"Nấm bào ngư phượng",scientific:"Pleurotus pulmonarius"},
  {id:"pleurotus-citrinopileatus",name:"Nấm bào ngư vàng",scientific:"Pleurotus citrinopileatus"},
  {id:"pleurotus-djamor",name:"Nấm bào ngư hồng",scientific:"Pleurotus djamor"},
  {id:"pleurotus-eryngii",name:"Nấm đùi gà",scientific:"Pleurotus eryngii"},
  {id:"pleurotus-cornucopiae",name:"Nấm bào ngư hoàng kim",scientific:"Pleurotus cornucopiae"},
  {id:"pleurotus-tuber-regium",name:"Nấm bào ngư hoàng đế",scientific:"Pleurotus tuber-regium"},
  {id:"flammulina-velutipes",name:"Nấm kim châm",scientific:"Flammulina velutipes"},
  {id:"auricularia-heimuer",name:"Nấm mộc nhĩ đen",scientific:"Auricularia heimuer"},
  {id:"volvariella-volvacea",name:"Nấm rơm",scientific:"Volvariella volvacea"},
  {id:"hericium-erinaceus",name:"Nấm đầu khỉ",scientific:"Hericium erinaceus"},
  {id:"grifola-frondosa",name:"Nấm maitake",scientific:"Grifola frondosa"},
  {id:"hypsizygus-marmoreus",name:"Nấm shimeji",scientific:"Hypsizygus marmoreus"},
  {id:"pholiota-microspora",name:"Nấm nameko",scientific:"Pholiota microspora"},
  {id:"cyclocybe-aegerita",name:"Nấm dương",scientific:"Cyclocybe aegerita"},
  {id:"tremella-fuciformis",name:"Nấm tuyết",scientific:"Tremella fuciformis"},
  {id:"calocybe-indica",name:"Nấm sữa Ấn Độ",scientific:"Calocybe indica"},
  {id:"agaricus-subrufescens",name:"Nấm hạnh nhân",scientific:"Agaricus subrufescens"},
  {id:"stropharia-rugosoannulata",name:"Nấm rượu vang",scientific:"Stropharia rugosoannulata"},
  {id:"tuber-melanosporum",name:"Nấm truffle đen",scientific:"Tuber melanosporum"},
  {id:"tuber-aestivum",name:"Nấm truffle mùa hè",scientific:"Tuber aestivum"}
].map(record=>({
  ...record,
  type:"edible",
  status:"Được dùng làm thực phẩm khi xác định đúng loài và có nguồn gốc rõ ràng",
  icon:"🍄",
  level:"Chỉ chọn sản phẩm thực phẩm đáng tin cậy",
  habitat:"Hồ sơ thực phẩm thương mại; không dùng sinh cảnh để nhận diện nấm hoang dã.",
  features:"Không thể xác định mẫu nấm thực tế chỉ bằng tên, màu sắc, hình dáng hoặc một ảnh.",
  note:"Loài được sử dụng làm thực phẩm; hồ sơ này không xác nhận mẫu nấm tự hái là an toàn.",
  toxin:"Nhầm lẫn với loài khác có thể gây ngộ độc nghiêm trọng.",
  warning:"Chỉ dùng sản phẩm đúng loài, có nguồn gốc đáng tin cậy và chế biến theo hướng dẫn; không tự hái nấm hoang dã.",
  uses:"Thực phẩm khi đúng loài và có nguồn gốc phù hợp.",
  effects:"Không dùng hồ sơ này để chẩn đoán hoặc quyết định ăn một mẫu nấm.",
  certainty:"Chỉ tham khảo tên loài; không xác minh mẫu thực tế.",
  taxonomy:""
}));

const ui = {
  cards:document.getElementById("cards"),
  tableBody:document.getElementById("safetyTableBody"),
  profileTitle:document.getElementById("profileTitle"),
  profileDesc:document.getElementById("profileDesc"),
  profileGrid:document.getElementById("profileGrid"),
  search:document.getElementById("searchInput"),
  count:document.getElementById("resultCount"),
  total:document.getElementById("totalCount"),
  sourceStatus:document.getElementById("sourceStatus"),
  clearSearch:document.getElementById("clearSearch"),
  suggestions:document.getElementById("searchSuggestions"),
  sort:document.getElementById("sortSelect"),
  summary:document.getElementById("resultSummary")
};

let allMushrooms=[...seedMushrooms,...commercialEdibleMushrooms];
let activeFilter="all";
let sortMode="relevance";
let currentPage=1;
let loadingTaxonomy=false;

function escapeHTML(value){
  return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}

function slugify(value){
  return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function relevanceScore(record,query){
  const name=record.name.toLowerCase();
  const scientific=record.scientific.toLowerCase();
  return (name===query?100:0)+(scientific===query?95:0)+(name.startsWith(query)?40:0)+(scientific.startsWith(query)?35:0)+(name.includes(query)?20:0)+(scientific.includes(query)?18:0);
}

function highlightText(value){
  const query=(ui.search?.value||"").trim();
  const safe=escapeHTML(value);
  if(!query)return safe;
  const escaped=query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return safe.replace(new RegExp(`(${escaped})`,"ig"),"<mark>$1</mark>");
}

function getFiltered(){
  const query=(ui.search?.value||"").trim().toLowerCase();
  const results=allMushrooms.filter(record=>{
    const matchesFilter=activeFilter==="all"||record.type===activeFilter;
    const searchable=`${record.name} ${record.scientific} ${record.status} ${record.habitat}`.toLowerCase();
    return matchesFilter&&(!query||searchable.includes(query));
  });
  if(sortMode==="name")results.sort((a,b)=>a.name.localeCompare(b.name,"vi"));
  else if(sortMode==="scientific")results.sort((a,b)=>a.scientific.localeCompare(b.scientific,"en"));
  else if(sortMode==="status")results.sort((a,b)=>a.status.localeCompare(b.status,"vi"));
  else if(query)results.sort((a,b)=>relevanceScore(b,query)-relevanceScore(a,query));
  return results;
}

function updateStats(){
  if(ui.total)ui.total.textContent=allMushrooms.length.toLocaleString("vi-VN");
  const known=document.getElementById("knownCount");
  if(known)known.textContent=allMushrooms.filter(record=>record.type!=="unknown").length.toLocaleString("vi-VN");
}

function renderPagination(pageCount){
  const box=document.getElementById("pagination");
  if(!box)return;
  const firstDisabled=currentPage===1?"disabled":"";
  const lastDisabled=currentPage===pageCount?"disabled":"";
  box.innerHTML=`<button type="button" aria-label="Trang đầu" title="Trang đầu" ${firstDisabled} data-page="1">Đầu</button><button type="button" aria-label="Trang trước" title="Trang trước" ${firstDisabled} data-page="${currentPage-1}">Trước</button><span>Trang <b>${currentPage.toLocaleString("vi-VN")}</b> / ${pageCount.toLocaleString("vi-VN")}</span><button type="button" aria-label="Trang sau" title="Trang sau" ${lastDisabled} data-page="${currentPage+1}">Sau</button><button type="button" aria-label="Trang cuối" title="Trang cuối" ${lastDisabled} data-page="${pageCount}">Cuối</button>`;
}

function updateSuggestions(){
  if(!ui.suggestions||!ui.search)return;
  const query=ui.search.value.trim().toLowerCase();
  const wrapper=ui.suggestions.parentElement;
  if(!query){ui.suggestions.innerHTML="";wrapper?.classList.remove("has-suggestions");return;}
  const matches=[];
  for(const record of allMushrooms){
    if(`${record.name} ${record.scientific}`.toLowerCase().includes(query))matches.push(record);
    if(matches.length===6)break;
  }
  ui.suggestions.innerHTML=matches.map(record=>`<button class="search-suggestion" type="button" role="option" data-suggestion-id="${escapeHTML(record.id)}"><span>${escapeHTML(record.icon)}</span><span><strong>${highlightText(record.name)}</strong><small>${highlightText(record.scientific)}</small></span></button>`).join("");
  wrapper?.classList.toggle("has-suggestions",matches.length>0);
}

function render(){
  const results=getFiltered();
  const pageCount=Math.max(1,Math.ceil(results.length/PAGE_SIZE));
  currentPage=Math.min(currentPage,pageCount);
  const startIndex=(currentPage-1)*PAGE_SIZE;
  const page=results.slice(startIndex,startIndex+PAGE_SIZE);
  const rangeStart=results.length?startIndex+1:0;
  const rangeEnd=startIndex+page.length;
  ui.cards.innerHTML=page.length?page.map(record=>`<article class="card ${escapeHTML(record.type)}"><div class="card-top"><div class="mushroom-icon">${escapeHTML(record.icon)}</div><span class="status ${escapeHTML(record.type)}">${escapeHTML(record.status)}</span></div><h3>${highlightText(record.name)}</h3><div class="scientific">${highlightText(record.scientific)}</div><p>${escapeHTML(record.note)}</p><div class="meta">🌿 ${escapeHTML(record.habitat)}</div><div class="card-tags"><span>${escapeHTML(record.level)}</span><span>${escapeHTML(record.certainty)}</span></div><button class="detail-btn" type="button" data-id="${escapeHTML(record.id)}">Xem hồ sơ</button></article>`).join(""):'<div class="empty-state">Không tìm thấy hồ sơ phù hợp.</div>';
  renderPagination(pageCount);
  if(ui.count)ui.count.textContent=`Hiển thị ${rangeStart.toLocaleString("vi-VN")}-${rangeEnd.toLocaleString("vi-VN")} / ${results.length.toLocaleString("vi-VN")}`;
  if(ui.summary){
    const query=(ui.search?.value||"").trim();
    const range=`${rangeStart.toLocaleString("vi-VN")}-${rangeEnd.toLocaleString("vi-VN")}`;
    ui.summary.textContent=query?`Tìm thấy ${results.length.toLocaleString("vi-VN")} hồ sơ · hiển thị ${range} · trang ${currentPage}/${pageCount}`:`Đang hiển thị ${range} / ${results.length.toLocaleString("vi-VN")} hồ sơ · trang ${currentPage}/${pageCount}`;
  }
  updateSuggestions();
}

function renderTable(){
  ui.tableBody.innerHTML=allMushrooms.slice(0,250).map(record=>{
    const category=record.type==="edible"?"safe":record.type==="toxic"?"toxic":"unknown";
    return `<tr><td><b>${escapeHTML(record.name)}</b><br><i>${escapeHTML(record.scientific)}</i></td><td><span class="pill ${category}">${escapeHTML(record.status)}</span></td><td>${escapeHTML(record.effects)}</td><td>${escapeHTML(record.level)}</td></tr>`;
  }).join("");
}

function showProfile(id){
  const record=allMushrooms.find(item=>item.id===id);
  if(!record)return;
  ui.profileTitle.textContent=`${record.name} — ${record.scientific}`;
  ui.profileDesc.textContent=record.note;
  ui.profileGrid.innerHTML=`<div class="profile-item highlight"><b>Trạng thái an toàn</b><span>${escapeHTML(record.status)}</span></div><div class="profile-item"><b>Độc tính</b><span>${escapeHTML(record.toxin)}</span></div><div class="profile-item"><b>Tác động đã biết</b><span>${escapeHTML(record.effects)}</span></div><div class="profile-item"><b>Đặc điểm nhận dạng</b><span>${escapeHTML(record.features)}</span></div><div class="profile-item"><b>Môi trường sống</b><span>${escapeHTML(record.habitat)}</span></div><div class="profile-item"><b>Mức cảnh báo</b><span>${escapeHTML(record.level)}</span></div><div class="profile-item wide"><b>Lưu ý</b><span>${escapeHTML(record.warning)}</span></div>`;
  document.getElementById("profile")?.scrollIntoView({behavior:"smooth",block:"start"});
}

async function fetchJSON(url){
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok)throw new Error(`GBIF HTTP ${response.status}`);
  return response.json();
}

function addTaxa(names){
  const known=new Set(allMushrooms.map(record=>record.scientific.toLowerCase()));
  let added=0;
  for(const name of names){
    const scientific=name.trim();
    if(!scientific||known.has(scientific.toLowerCase()))continue;
    known.add(scientific.toLowerCase());
    allMushrooms.push({
      id:`gbif-${slugify(scientific)}-${allMushrooms.length}`,
      name:`Nấm ${scientific}`,
      scientific,
      type:"unknown",
      status:"CHƯA ĐỦ DỮ LIỆU AN TOÀN",
      icon:"🔬",
      level:"Chưa đánh giá",
      habitat:"Chưa có dữ liệu sinh cảnh trong hồ sơ này.",
      features:"Tên được lấy từ danh mục phân loại GBIF; không đủ để nhận dạng mẫu thực tế.",
      note:"Hồ sơ danh pháp; chưa có đánh giá độc tính trong ứng dụng.",
      toxin:"Chưa có đánh giá độc tính đủ tin cậy.",
      warning:"Không dùng hồ sơ này để quyết định ăn nấm hoang dã.",
      uses:"Chưa có dữ liệu sử dụng đáng tin cậy.",
      effects:"Chưa có dữ liệu đáng tin cậy.",
      certainty:"Chỉ xác minh danh pháp; chưa xác minh an toàn.",
      taxonomy:"GBIF Backbone Taxonomy"
    });
    added++;
    if(allMushrooms.length>=TARGET_SPECIES)break;
  }
  return added;
}

async function loadExtendedTaxa(){
  if(loadingTaxonomy)return;
  loadingTaxonomy=true;
  let cachedNames=[];
  try{
    try{
      const cached=JSON.parse(localStorage.getItem(TAXONOMY_CACHE_KEY)||"null");
      if(cached?.savedAt&&Date.now()-cached.savedAt<CACHE_TTL&&Array.isArray(cached.names)){
        cachedNames=cached.names.slice(0,Math.max(0,TARGET_SPECIES-allMushrooms.length));
        addTaxa(cachedNames);
      }
    }catch{}
    updateStats();render();renderTable();

    if(allMushrooms.length<TARGET_SPECIES){
      ui.sourceStatus.textContent=`Đang tìm các lớp nấm trên GBIF · ${allMushrooms.length.toLocaleString("vi-VN")} / ${TARGET_SPECIES.toLocaleString("vi-VN")}`;
      const params=new URLSearchParams({highertaxon_key:String(GBIF_KINGDOM_KEY),rank:"CLASS",status:"ACCEPTED",limit:String(GBIF_PAGE_SIZE),offset:"0"});
      const classData=await fetchJSON(`${GBIF_API}?${params}`);
      const classes=(classData.results||[]).filter(taxon=>taxon.rank==="CLASS"&&Number.isInteger(taxon.key));
      const cacheNames=[...cachedNames];
      const known=new Set(allMushrooms.map(record=>record.scientific.toLowerCase()));

      for(const taxonClass of classes){
        for(let offset=0;offset<=MAX_GBIF_OFFSET&&allMushrooms.length<TARGET_SPECIES;offset+=GBIF_PAGE_SIZE){
          const speciesParams=new URLSearchParams({highertaxon_key:String(taxonClass.key),rank:"SPECIES",status:"ACCEPTED",limit:String(GBIF_PAGE_SIZE),offset:String(offset)});
          const data=await fetchJSON(`${GBIF_API}?${speciesParams}`);
          if(!Array.isArray(data.results)||!data.results.length)break;
          const names=[];
          for(const result of data.results){
            const scientific=result.rank==="SPECIES"&&(result.canonicalName||result.scientificName);
            if(!scientific||known.has(scientific.toLowerCase()))continue;
            known.add(scientific.toLowerCase());
            names.push(scientific);
            if(allMushrooms.length+names.length>=TARGET_SPECIES)break;
          }
          if(names.length){addTaxa(names);cacheNames.push(...names);}
          ui.sourceStatus.textContent=`Đang nạp GBIF: ${allMushrooms.length.toLocaleString("vi-VN")} / ${TARGET_SPECIES.toLocaleString("vi-VN")} · ${taxonClass.canonicalName||taxonClass.scientificName||"lớp nấm"}`;
          updateStats();
          if(allMushrooms.length%5000<GBIF_PAGE_SIZE){render();renderTable();}
          if(data.results.length<GBIF_PAGE_SIZE)break;
          await new Promise(resolve=>setTimeout(resolve,100));
        }
        if(allMushrooms.length>=TARGET_SPECIES)break;
      }
      try{localStorage.setItem(TAXONOMY_CACHE_KEY,JSON.stringify({savedAt:Date.now(),names:cacheNames}));}catch{}
    }
    ui.sourceStatus.textContent=allMushrooms.length>=TARGET_SPECIES
      ?`Đã nạp ${allMushrooms.length.toLocaleString("vi-VN")} hồ sơ danh pháp GBIF.`
      :`Đã nạp ${allMushrooms.length.toLocaleString("vi-VN")} / ${TARGET_SPECIES.toLocaleString("vi-VN")} hồ sơ; GBIF không còn dữ liệu phù hợp.`;
  }catch(error){
    console.warn("GBIF taxonomy load failed:",error);
    ui.sourceStatus.textContent=`Không kết nối được GBIF · đang có ${allMushrooms.length.toLocaleString("vi-VN")} hồ sơ.`;
  }finally{
    loadingTaxonomy=false;
    updateStats();render();renderTable();
  }
}

document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  activeFilter=button.dataset.filter||"all";
  currentPage=1;
  render();
}));

ui.search?.addEventListener("input",()=>{currentPage=1;render();});
ui.search?.addEventListener("focus",updateSuggestions);
ui.search?.addEventListener("keydown",event=>{
  if(event.key==="Escape"){ui.search.value="";currentPage=1;render();ui.search.blur();}
});
ui.clearSearch?.addEventListener("click",()=>{if(ui.search)ui.search.value="";currentPage=1;render();ui.search?.focus();});
ui.sort?.addEventListener("change",()=>{sortMode=ui.sort.value;currentPage=1;render();});
ui.suggestions?.addEventListener("click",event=>{
  const button=event.target.closest("[data-suggestion-id]");
  if(!button)return;
  const record=allMushrooms.find(item=>item.id===button.dataset.suggestionId);
  if(record&&ui.search){ui.search.value=record.scientific;currentPage=1;render();showProfile(record.id);}
});
document.addEventListener("click",event=>{
  if(!event.target.closest(".search-panel"))ui.suggestions?.parentElement?.classList.remove("has-suggestions");
});
ui.cards.addEventListener("click",event=>{
  const button=event.target.closest(".detail-btn");
  if(button)showProfile(button.dataset.id);
});
document.getElementById("pagination")?.addEventListener("click",event=>{
  const button=event.target.closest("[data-page]");
  if(!button||button.disabled)return;
  currentPage=Number(button.dataset.page);
  render();
  ui.cards.scrollIntoView({behavior:"smooth",block:"start"});
});

document.getElementById("quizBtn")?.addEventListener("click",()=>{
  const answers={q1:"a",q2:"a",q3:"b"};
  let score=0,answered=0;
  for(const [name,answer] of Object.entries(answers)){
    const selected=document.querySelector(`input[name="${name}"]:checked`);
    if(selected){answered++;if(selected.value===answer)score++;}
  }
  const result=document.getElementById("result");
  if(result)result.textContent=answered<3?`Hãy trả lời đủ 3 câu. Hiện đã trả lời ${answered}/3.`:`Kết quả: ${score}/3 câu đúng.`;
});

const menuButton=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
menuButton?.addEventListener("click",()=>{
  const visible=nav?.classList.toggle("show");
  menuButton.setAttribute("aria-expanded",String(Boolean(visible)));
});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  nav.classList.remove("show");
  menuButton?.setAttribute("aria-expanded","false");
}));

updateStats();
render();
renderTable();
loadExtendedTaxa();
