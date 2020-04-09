const balanceValue = document.querySelector("#balance");
const incomeValue = document.querySelector("#money-plus");
const expenseValue = document.querySelector("#money-minus");

const transactionNameInput = document.querySelector("#text");
const amountInput = document.querySelector("#amount");
const submitButton = document.querySelector("#form .btn");
const transactionsContainer = document.querySelector("#transactions");

var lastId = null;
var transactionsList = [];

const calculateIncomeExpense = () => {
  var income = 0;
  var expense = 0;
  var balance = 0;
  transactionsList.forEach(({ amount }) => {
    if (amount > 0) {
      income += amount;
    } else {
      expense -= amount;
    }
  });

  incomeValue.textContent = `+ ${Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(income)}`;

  expenseValue.textContent = `- ${Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(expense)}`;

  balance = income - expense;

  balanceValue.textContent = `${Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(balance)}`;
};

const deleteTransactionLi = (id) => {
  transactionsList = transactionsList.filter((item) => item.id !== id);

  transactionsContainer.innerHTML = "";
  transactionsList.forEach(generateTransactionLi);
  calculateIncomeExpense();
};

const generateTransactionLi = ({ id, name, amount }) => {
  const transactionLi = `
  <li class=${amount > 0 ? "plus" : "minus"}>
    ${name} <span>${amount > 0 ? "+ " : "- "}${Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    amount > 0 ? amount : amount * -1
  )}</span><button class="delete-btn" data-id="${id}">x</button
  </li`;

  transactionsContainer.innerHTML += transactionLi;
  calculateIncomeExpense();
};

transactionsContainer.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    const transactionId = Number(clickedElement.getAttribute("data-id"));
    deleteTransactionLi(transactionId);
  }
});

const handleClickSubmitButton = (event) => {
  event.preventDefault();

  const name = transactionNameInput.value;
  const amount = Number(amountInput.value);
  const id = (lastId += 1);

  transactionsList.push({ id, name, amount });

  localStorage.setItem(
    "@controlOfExpense:transactionsList",
    JSON.stringify(transactionsList)
  );

  localStorage.setItem("@controlOfExpense:lastId", id);

  generateTransactionLi({ id, name, amount });
};

submitButton.addEventListener("click", handleClickSubmitButton);

lastId = Number(localStorage.getItem("@controlOfExpense:lastId")) || -1;

transactionsList =
  JSON.parse(localStorage.getItem("@controlOfExpense:transactionsList")) || [];

transactionsList.forEach(generateTransactionLi);

calculateIncomeExpense();
