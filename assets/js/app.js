const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");


let items;

btnNew.onclick = () => {
    if(descItem.value === "" || amount.value === "" || type.value === ""){
        return alert("Preencha todos os campos");
    }

    items.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value
    });

    setItensBD();

    loadItens();

    descItem.value = "";
    amount.value = "";
}

function deleteItem(index){
    items.splice(index, 1);
    setItensBD();
    loadItens();
}

function insertItem(item, index){
    let tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
        item.type === "Entrada"
            ? '<i class="bx bxs-chevron-up-circle"></i>'
            : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
    `;

    tbody.appendChild(tr);
}

function loadItens(){
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotals();
}

function getTotals(){
    const amountIncomes = items
        .filter((item) => item.type === "Entrada")
        .map((transaction) => Number(transaction.amount));
    
    const amountExpenses = items
        .filter((item) => item.type === "Saída")
        .map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);
    
    const totalExpenses = Math.abs(
        amountExpenses.reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2);

    const totalItems = (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML = `R$ ${totalIncomes}`;
    expenses.innerHTML =`R$ ${totalExpenses}`;
    total.innerHTML = `R$ ${totalItems}`;
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
    localStorage.setItem("db_items", JSON.stringify(items));

loadItens();

const content = document.querySelector(".content-notes");
const btnNotes = document.querySelector(".addNote-content");

//Armazenar informações no localStorage do navegador
let items_db = localStorage.getItem("items_db")
  ? JSON.parse(localStorage.getItem("items_db"))
  : [];

//Array de armazenamento de cores para os blocos de notas
const colors = [
    "#fff7b0"
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
btnNotes.onclick = () => {
    addHTML();

    addEvents();
};

//Função add - com parametro de inserção da nota
function addHTML(item) {
    const div = document.createElement("div");
  
    div.innerHTML = `<div class="item" style="background-color: ${
      item?.color || randomColor()
    }">
      <span class="current-date">${getCurrentDate()}</span>
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

//Função que insere a data atual
function getCurrentDate(){
    const currentDate = new Date();
  const day = currentDate.getDate();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

loadItems();