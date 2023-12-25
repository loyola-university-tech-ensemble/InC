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

  let about = document.getElementById("QRLink");
  let qrCode = document.createElement("img");
  let link = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=";
  let thisPage = window.location.href;
  //console.log(thisPage);
//  console.log(document.URL);
  qrCode.src = link + thisPage;
//  qrCode.src = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=https://www.mrc-productivity.com/techblog/?p=1172";
  about.appendChild(qrCode);
  
