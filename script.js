let boxes = document.querySelectorAll(".boxes");
let ticketArea = document.querySelector(".ticket-area");
let add = document.querySelectorAll(".filters")[0];
let body = document.querySelector("body");
let modalVisible = false;
const shortid = new ShortUniqueId();

let colors = {
    pink : "hotpink",
    blue : "aqua",
    green :  "chartreuse",
    black : "black"
}

if(!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
}

for(let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function(e) {
        if(e.currentTarget.classList.contains("selected-filter")) {
            e.currentTarget.classList.remove("selected-filter");
            loadTicket();
        } else {
            let innerDiv = boxes[i].querySelector(".boxes div");
            let color = innerDiv.classList[0].split("-")[0];
            e.currentTarget.classList.add("selected-filter");
            loadTicket(color);
            // ticketArea.style.background = colors[color];
        }
    })
}

let activateDelete = false;
let deleteTicket = document.querySelectorAll(".filters")[1];
deleteTicket.addEventListener("click", function(e) {
    if(!activateDelete) {
        // e.currentTarget.style.backgroundColor = "black";
        e.currentTarget.classList.add("delete-state");
        activateDelete = true;
    } else {
        e.currentTarget.classList.remove("delete-state");
        activateDelete = false;
    }
});


add.addEventListener("click", function() {
    if(modalVisible) return;
    
    if(deleteTicket.classList.contains("delete-state")) {
        activateDelete = false;
        deleteTicket.classList.remove("delete-state");
    }

    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute("click-first", true);
    let modalHTML= "";
    modalHTML += `
    <div class="write" contenteditable>Enter your task</div>
    <div class="color">
    <div class="colors pink"></div>
    <div class="colors blue"></div>
    <div class="colors green"></div>
    <div class="colors black active-modal"></div>
    </div>`
    modal.innerHTML = modalHTML;
    
    let wa = modal.querySelector(".write");
    wa.addEventListener("click", function(e) {
        if(modal.getAttribute("click-first")=="true") {
            wa.innerHTML = "";
            modal.setAttribute("click-first", false);
        }
    });
    
    let pickColor = modal.querySelectorAll(".colors");
    for(let i = 0; i < pickColor.length; i++) {
        pickColor[i].addEventListener("click", function(e) {
        for(let j = 0; j < pickColor.length; j++) {
            pickColor[j].classList.remove("active-modal");
        }
        e.currentTarget.classList.add("active-modal");
    });
}


wa.addEventListener("keypress", function(e) {
    if(e.key=="Enter") {
        let color = document.querySelector(".active-modal");
            let colorCode = color.classList[1];            
            let ticket = document.createElement("div");
            let text = wa.innerText;
            ticket.classList.add("ticket");
            let id = shortid();
            console.log(colorCode);
            ticket.innerHTML = `<div class="ticket-color ${colorCode}"></div>
            <div class="written-area">
            <div class="ticket-id">#${id}</div>
            <div class="written" contenteditable>${text}</div>
            </div>`;

            saveTicketOnLocalStorage(id, colorCode, text);

            let ticketWritingArea = ticket.querySelector(".written");
            ticketWritingArea.addEventListener("input", function(e) {
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIdx = -1;
                for(let i = 0; i < tasksArr.length; i++) {
                    if(id == tasksArr[i].id) {
                        reqIdx = i;
                        break;
                    }
                }

                tasksArr[reqIdx].text = e.currentTarget.innerText;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));

            });

            let ticketColorDiv = ticket.querySelector(".ticket-color");
            let colorClasses = ["pink", "blue", "green", "black"];
            ticketColorDiv.addEventListener("click", function(e) {
                let currentColor = e.currentTarget.classList[1];
                let index = colorClasses.indexOf(currentColor);
                index = (index + 1) % 4;
                e.currentTarget.classList.remove(currentColor);
                e.currentTarget.classList.add(colorClasses[index]);
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIdx = -1;
                for(let i = 0; i < tasksArr.length; i++) {
                    if(id == tasksArr[i].id) {
                        reqIdx = i;
                        break;
                    }
                }
                tasksArr[reqIdx].colorCode = colorClasses[index];
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            });    

            ticketArea.appendChild(ticket);
            ticket.addEventListener("click", function(e) {
                if(activateDelete) {
                    let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                    tasksArr = tasksArr.filter(function(el) {
                        return el.id != id;
                    });
                    localStorage.setItem("tasks", JSON.stringify(tasksArr));
                    e.currentTarget.remove();
                }
            });
            
            modal.remove();
            modalVisible = false;
        }
    });
    body.appendChild(modal);
    modalVisible = true;
});

function saveTicketOnLocalStorage(id, colorCode, text) {
    let reqdObject = {id, colorCode, text};
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    tasksArr.push(reqdObject);
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

//refresh/load
function loadTicket(passedColor) {
    //agr koi ticket ui pe pehle se hai usko remove krde
    let allTickets = document.querySelectorAll(".ticket");
    for(let i = 0; i < allTickets.length; i++) {
        allTickets[i].remove();
    }

    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    for(let i = 0; i < tasksArr.length; i++) {
        let id = tasksArr[i].id;
        let colorCode = tasksArr[i].colorCode;
        let text = tasksArr[i].text;

        if(passedColor) {
            if(passedColor != colorCode) continue;
        }    

        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
            // console.log(colorCode);
        ticket.innerHTML = `<div class="ticket-color ${colorCode}"></div>
            <div class="written-area">
            <div class="ticket-id">#${id}</div>
            <div class="written" contenteditable>${text}</div>
            </div>`;
        
            let ticketWritingArea = ticket.querySelector(".written");
            ticketWritingArea.addEventListener("input", function(e) {
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIdx = -1;
                for(let i = 0; i < tasksArr.length; i++) {
                    if(id == tasksArr[i].id) {
                        reqIdx = i;
                        break;
                    }
                }

                tasksArr[reqIdx].text = e.currentTarget.innerText;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));

            });

            let ticketColorDiv = ticket.querySelector(".ticket-color");
            let colorClasses = ["pink", "blue", "green", "black"];
            ticketColorDiv.addEventListener("click", function(e) {
                let currentColor = e.currentTarget.classList[1];
                let index = colorClasses.indexOf(currentColor);
                index = (index + 1) % 4;
                e.currentTarget.classList.remove(currentColor);
                e.currentTarget.classList.add(colorClasses[index]);
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIdx = -1;
                for(let i = 0; i < tasksArr.length; i++) {
                    if(id == tasksArr[i].id) {
                        reqIdx = i;
                        break;
                    }
                }
                tasksArr[reqIdx].colorCode = colorClasses[index];
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            });    

            ticket.addEventListener("click", function(e) {
                if(activateDelete) {
                    let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                    tasksArr = tasksArr.filter(function(el) {
                        return el.id != id;
                    });
                    localStorage.setItem("tasks", JSON.stringify(tasksArr));
                    e.currentTarget.remove();
                }
            });        
            
            ticketArea.appendChild(ticket);
    }
}

loadTicket();














 
