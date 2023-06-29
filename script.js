const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_-+={[}]|:;<,>.?/";
// const allCheckBOx = document.querySelectorAll("[input type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to gray
setIndicator("#ccc")
//set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength-min) * 100/(max-min))+"% 100%"
  
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandNumber() {
  return getRandInteger(0, 9);
}

function generateLowerCase() {
 return  String.fromCharCode(getRandInteger(97, 123));
}

function generateUpperCase() {
 return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbol() {
  const index = getRandInteger(0, symbols.length);
  return symbols.charAt(index);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;  
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerHTML = "failed";
  }
  //to make copy wala span visible
  copyMsg.classList("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    let str = ""
    array.forEach((el)=>(str +=el))
    return str

}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkbox;
    handleSlider();
  }

  //   lets start the journey to find new password
  password = "";

  // lets put the stuff mentioned by checkboxes
  //   if (upperCaseCheck.checked) {
  //     password += generateUpperCase();
  //   }
  //   if (lowerCaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (symbolCheck.checked) {
  //     password += generateSymbol();
  //   }
  //   if (numbersCheck.cheked) {
  //     password += generateRandNumber();
  //   }

  let funcArr = [];
  if (upperCaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowerCaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandNumber);
  }

  //compulsary addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password))

  //show in ui
  passwordDisplay.value = password;
  //clculate strength
  calcStrength()
});


