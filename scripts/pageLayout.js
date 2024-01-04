document.querySelector('button')?.addEventListener('click', async () => {
  await Tone.start()
  console.log('audio is ready')
})

let menus = document.querySelectorAll("button.menu"); // get all the menu buttons
//attach click eventListeners to each menu button controlling the next 'contents' class div in the document
menus.forEach((menuButton) => {
//  console.log("menu button: " + menuButton);
  let div = menuButton.nextElementSibling;
  if(div.classList.contains('contents')){
//      console.log(div);
    menuButton.addEventListener('click', () => {
      if (div.style.display === "none") {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    })
  }
});
let sequenceDiv = document.getElementById("sequences");
let backButton = document.getElementById("back-button");
let forwardButton = document.getElementById("forward-button");
let sequenceNum = 0;
/*
forwardButton.addEventListener('click', () => {
  sequenceNum ++;
  if(sequenceNum > 49){
    sequenceNum = 49; // stop 4 from the end
  }
  let y = sequenceNum * 74.25;
  sequenceDiv.scroll({top: y, left: 0, behavior: "smooth",});
  console.log(sequenceNum);
  for(let i = 0; i < sequenceNum; i++){
//    sketches[i].noLoop();
  }
  if(sequenceNum > 0){
    sketches[sequenceNum-1].noLoop();
  }
});
*/
forwardButton.addEventListener('click', scroll);

function scroll(e){
  let inc = 0; // increment
  switch(e.currentTarget.id){
    case "forward-button":
      inc = 1;
      break;  
    case "back-button":
      inc = -1;
      break;
    default:
      inc = 0;

  }
  sequenceNum += inc;
  
  if(sequenceNum > 49){
    sequenceNum = 49; // stop 4 from the end
  } else if(sequenceNum < 0){
    sequenceNum = 0; // stop at 0
  }
  let id = "sequence_" + (sequenceNum +1);
  let seq = document.getElementById(id);
//  let pos = seq.getRelativePos(seq);
  let y = seq.offsetTop;
  //let y = sequenceNum * 74.25;
  //sequenceDiv.scroll({top: y, left: 0, behavior: "smooth",});
  sequenceDiv.scroll({top: y, left: 0, behavior: "smooth",});
//  console.log(sequenceNum);
  for(let i = sequenceNum + 4; i < 53; i++){
    sketches[i].noLoop(); // unloop everything outside the view
  }
  if(sequenceNum > 0){
    sketches[sequenceNum-1].noLoop();
  }
} 

 backButton.addEventListener('click', scroll);
/*
backButton.addEventListener('click', () => {
  sequenceNum --;
  if(sequenceNum < 0){
    sequenceNum = 0;
  }
  let y = sequenceNum * 74.25;
  sequenceDiv.scroll({top: y, left: 0, behavior: "smooth",})
  console.log(sequenceNum);
  for(let i = sequenceNum + 4; i < 53; i++){
    sketches[i].noLoop(); //unloop everything past the visible range
  }
});
*/
let qrLink = document.getElementById("QRLink");
let qrCode = document.createElement("img");
let link = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=";
let thisPage = window.location.href;
  //console.log(thisPage);
//  console.log(document.URL);
qrCode.src = link + thisPage;
//  qrCode.src = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=https://www.mrc-productivity.com/techblog/?p=1172";
qrLink.appendChild(qrCode);
  
