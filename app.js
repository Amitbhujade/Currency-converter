const BASE_URL = `https://api.frankfurter.app/latest?`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);

    if (isNaN(amtVal) || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;
    const URL = `${BASE_URL}amount=${amtVal}&from=${fromCurrency}&to=${toCurrency}`;

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    if (!data || !data.rates || !data.rates[toCurrency]) {
      throw new Error(`Failed to retrieve a valid exchange rate.`);
    }

    let rate = data.rates[toCurrency];
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    msg.innerText = 'Failed to retrieve exchange rate. Please try again later.';
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
