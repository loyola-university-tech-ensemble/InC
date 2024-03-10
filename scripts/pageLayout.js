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

/*sequenceDiv.addEventListener("scrollend", ()=>{
  // console.log("scroll end")
  endScrolling();
})
*/
if ('onscrollend' in window) {
  sequenceDiv.onscrollend = endScrolling;
}
else {
  sequenceDiv.onscroll = event => {
    clearTimeout(window.scrollEndTimer)
    window.scrollEndTimer = setTimeout(endScrolling, 100)
  }
}

function endScrolling(){
  let divTop = sequenceDiv.scrollTop;
  let divBottom = sequenceDiv.scrollTop + sequenceDiv.clientHeight;
  let seqDiv;
  let s = 0;
  for(let i = 0; i < sketches.length; i++){
    seqDiv = document.getElementById("sequence_" + (i + 1));
    let top = seqDiv.offsetTop;
    if(top >= divTop - 5 && top <= divBottom - 5){
      console.log("sequence " + (i + 1) + " visible");
      sketches[i].enable();
      sequenceNum = i - s; // locate the current top player for back/fwd buttons
      s++; // keep track of how many are visible
    } else {
      sketches[i].noLoop();
      sketches[i].disable();
    }
  }
}

forwardButton.addEventListener('click', scroll);
backButton.addEventListener('click', scroll);

window.addEventListener("load", (event) => {
//  console.log("page is fully loaded");
  if ('onscrollend' in window) {
    backButton.click(); // most browsers
  }
  else {
    endScrolling(); //scrollend unsupported
    //Safari MacOS and iOS
  }
});

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
  
  if(sequenceNum > (sketches.length - 4)){
    sequenceNum = sketches.length - 4; // stop 4 from the end
  } else if(sequenceNum < 0){
    sequenceNum = 0; // stop at 0
  }
  let id = "sequence_" + (sequenceNum +1);
  let seq = document.getElementById(id);
  let y = seq.offsetTop;
//let y = sequenceNum * 74.25;
  sequenceDiv.scroll({top: y, left: 0, behavior: "smooth",});
  
} 

/** generate custom QR code leading to the hosted page (wherever it is) */
let qrLink = document.getElementById("QRLink");
let qrCode = document.createElement("img");
let link = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=";
let thisPage = window.location.href;
console.log(thisPage);
//  console.log(document.URL);
qrCode.src = link + thisPage;
//  qrCode.src = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=https://www.mrc-productivity.com/techblog/?p=1172";
qrLink.appendChild(qrCode);
