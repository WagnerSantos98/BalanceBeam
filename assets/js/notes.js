const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");

//Armazenar informações no localStorage do navegador
let items_db = localStorage.getItem("items_db")
  ? JSON.parse(localStorage.getItem("items_db"))
  : [];

//Array de armazenamento de cores para os blocos de notas
const colors = [
    "#845ec2",
    "#008f7a",
    "#008e9b",
    "#ffc75f",
    "#ff8066",
    "#ba3caf"
];

//Variável de randomico selecionando as cores aleatoriamente
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

 //Função de inicialização
 function loadItems(){
    content.innerHTML = "";
    verifyNulls();

    items_db.forEach((item, i) => {
        addHTML(item, i);
    });

    addEvents();
}

//Botão de inserção
btnNew.onclick = () => {
    addHTML();

    addEvents();
};

//Função add - com parametro de inserção da nota
function addHTML(item) {
    const div = document.createElement("div");
  
    div.innerHTML = `<div class="item" style="background-color: ${
      item?.color || randomColor()
    }">
      <span class="remove">X</span>
      <textarea>${item?.text || ""}</textarea>
    </div>`;
  
    content.appendChild(div);
}

function addEvents() {
    const notes = document.querySelectorAll(".item textarea");
    const remove = document.querySelectorAll(".item .remove");
  
    notes.forEach((item, i) => {
      item.oninput = () => {
        items_db[i] = {
          text: item.value,
          color: items_db[i]?.color || item.parentElement.style.backgroundColor,
        };
  
        localStorage.setItem("items_db", JSON.stringify(items_db));
      };
    });
  
    remove.forEach((item, i) => {
      item.onclick = () => {
        content.children[i].remove();
        if (items_db[i]) {
          items_db.splice(i, 1);
          localStorage.setItem("items_db", JSON.stringify(items_db));
        }
        addEvents();
      };
    });
  }

//Função de verificação de não nulos
function verifyNulls(){
    items_db = items_db.filter((item) => item);
    localStorage.setItem("items_db", JSON.stringify(items_db));
}

loadItems();
