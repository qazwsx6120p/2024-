let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

// 動畫 class
const time_line = new TimelineMax();

// EVENT 事件
const EVENT = {
  CLICK: "click",
  CHANGE: "change",
  ENTER: "Enter",
  TRANSITIONED_END: "transitionend",
};

// // ========= 開場動畫 =========
/**
 * @param1 控畫控制的對象
 * @param2 是持續時間
 * @param3 控制對象的原是狀態
 * @param4 控制對象的動畫結束後的狀態
 * @param5 提早開始執行動畫 */
time_line
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    // 提早 1.2s 執行動畫
    "-=1.2"
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

// 2.5s 將開場動畫標籤關閉
window.setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500);

// =========  避免將資料交到後端 =========

// 禁止整個網站 enter key
window.addEventListener("keypress", (e) => {
  if (e.key === EVENT.ENTER) e.preventDefault();
});

// 防止 form 內部的 btn 交出表單 (nodeList)
let allBtn = document.querySelectorAll("button");

// 禁止所有按鈕交出表單
allBtn.forEach((btn) => {
  btn.addEventListener(EVENT.CLICK, (e) => e.preventDefault());
});

// ========= 分數 select input 更換顏色 =========

// select事件監聽
let allSelects = document.querySelectorAll("select");
allSelects.forEach((select) => {
  select.addEventListener(EVENT.CHANGE, (e) => {
    setGPA();
    changeSelectColor(e.target); // 當前觸發事件的 select 標籤
  });
});

/**
 * 更改 select 顏色
 * @select 當前觸發事件的 select */
function changeSelectColor(select) {
  switch (select.value) {
    case "A":
    case "A-":
      select.style.backgroundColor = "lightgreen";
      select.style.color = "black";
      break;
    case "B+":
    case "B":
    case "B-":
      select.style.backgroundColor = "yellow";
      select.style.color = "black";
      break;
    case "C+":
    case "C":
    case "C-":
      select.style.backgroundColor = "orange";
      select.style.color = "black";
      break;
    case "D+":
    case "D":
    case "D-":
      select.style.backgroundColor = "red";
      select.style.color = "black";
      break;
    case "F":
      select.style.backgroundColor = "grey";
      select.style.color = "white";
      break;
    case "":
      target.style.backgroundColor = "white";
      break;
  }
}
// ========= 依照分數換 GPA 文字 =========

// 改變學分 GPA 也要一起更新
let credits = document.querySelectorAll(".class-credit");
credits.forEach((input) => {
  input.addEventListener(EVENT.CHANGE, () => {
    setGPA();
  });
});

/**
 * 取得向對應的評分分數
 * @grade 評分的分數 */
function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}
/**
 * @example
 * 兩門科目
 * 3學分  A (4.0評分)
 * 4學分  B (3.0評分)
 * @GPA公式 : (( 學分 x 評分 ) + ( 學分 x 評分 )) / 學分 + 學分
 * 依照 GPA 公式換算 GPA */
function setGPA() {
  /** form 長度 */
  const formLength = document.querySelectorAll("form").length;
  /** 學分 */
  const credits = document.querySelectorAll(".class-credit");
  /** 評分 */
  const selects = document.querySelectorAll("select");
  /** GPA公式的分子 */
  let sum = 0;
  /** GPA公式的分母 */
  let creditSum = 0;

  for (let i = 0; i < credits.length; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      creditSum += credits[i].valueAsNumber;
    }
  }
  for (let i = 0; i < formLength; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }
  /** GPA 結果 */
  let result;

  /** 預防分母是 0，且取小數點後兩位 */
  creditSum === 0 ? (result = "0.00") : (result = (sum / creditSum).toFixed(2));

  /** GPA 顯示 */
  document.querySelector("#result-gpa").innerText = result;
}

// ========= 增加/刪除 form =========

let addButton = document.querySelector(".plus-btn");
addButton.addEventListener("click", () => {
  let newForm = document.createElement("form");
  let newDiv = document.createElement("div");
  newDiv.classList.add("grader");

  // 製作五個小元素
  let newInput1 = document.createElement("input");
  newInput1.setAttribute("type", "text");
  newInput1.setAttribute("list", "opt");
  newInput1.setAttribute("placeholder", "課別");
  newInput1.classList.add("class-type");

  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text");
  newInput2.setAttribute("placeholder", "課別編號");
  newInput2.classList.add("class-number");

  let newInput3 = document.createElement("input");
  newInput3.setAttribute("type", "number");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.classList.add("class-credit");
  newInput3.setAttribute("placeholder", "學分");

  // here is the select tag
  let newSelect = document.createElement("select");
  newSelect.classList.add("select");
  var opt1 = document.createElement("option");
  opt1.setAttribute("value", "");
  let textNode1 = document.createTextNode("");
  opt1.appendChild(textNode1);
  var opt2 = document.createElement("option");
  opt2.setAttribute("value", "A");
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);
  var opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-");
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);
  var opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+");
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);
  var opt5 = document.createElement("option");
  opt5.setAttribute("value", "B");
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);
  var opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-");
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);
  var opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+");
  opt7.appendChild(textNode7);
  var opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C");
  opt8.appendChild(textNode8);
  var opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-");
  opt9.appendChild(textNode9);
  var opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+");
  opt10.appendChild(textNode10);
  var opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D");
  opt11.appendChild(textNode11);
  var opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-");
  opt12.appendChild(textNode12);
  var opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F");
  opt13.appendChild(textNode13);

  let newButton = document.createElement("button");
  newButton.classList.add("trash-button");
  let newI = document.createElement("i");
  newI.classList.add("fas");
  newI.classList.add("fa-trash");
  newButton.appendChild(newI);

  // appendChild
  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);
  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newButton);
  newForm.appendChild(newDiv);
  document.querySelector(".all-input").appendChild(newForm);

  newForm.style.animation = "scaleUp 0.5s ease forwards";

  // 為動態製作出的新元素增加 addEventListener
  newInput3.addEventListener(EVENT.CHANGE, () => {
    setGPA();
  });

  newSelect.addEventListener(EVENT.CHANGE, (e) => {
    setGPA();
    changeSelectColor(e.target); // 當前觸發事件的 select 標籤
  });

  // ========= 刪除 form =========
  newButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    e.target.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        e.target.remove();
        setGPA();
      }
    );
  });
});

// ========= 排序功能 (使用 mergeSort 演算法) =========

let btn1 = document.querySelector(".sort-descending");
let btn2 = document.querySelector(".sort-ascending");
btn1.addEventListener(EVENT.CLICK, () => {
  handleSorting("descending"); // 大到小
});

btn2.addEventListener(EVENT.CLICK, () => {
  handleSorting("ascending"); // 小到大
});

function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number > a2[j].class_grade_number) {
      result.push(a2[j]);
      j++;
    } else {
      result.push(a1[i]);
      i++;
    }
  }
  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }
  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length == 0) return; // 陣列為 0 不用排序
  if (arr.length == 1) return arr; // 陣列為 1 不用排序 return arr

  let middle = Math.floor(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, arr.length);
  return merge(mergeSort(left), mergeSort(right));
}

function handleSorting(direction) {
  let graders = document.querySelectorAll("div.grader");
  let objectArray = [];

  for (let i = 0; i < graders.length; i++) {
    let class_name = graders[i].children[0].value; // 課別
    let class_number = graders[i].children[1].value; //課別編號
    let class_credit = graders[i].children[2].value; //學分
    let class_grade = graders[i].children[3].value; //分數

    // 使用者完全沒有填寫 form 的狀況
    let isAllInputNull =
      class_name == "" &&
      class_number == "" &&
      class_credit == "" &&
      class_grade == "";

    // form 至少填寫一項
    if (!isAllInputNull) {
      let class_object = {
        class_name,
        class_number,
        class_credit,
        class_grade,
      };
      objectArray.push(class_object);
    }
  }

  // 取得 Obj Array 後，把成績換成數字，並在 class_object 賦予一個新的值 class_grade_number
  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].class_grade_number = convertor(objectArray[i].class_grade);
  }
  objectArray = mergeSort(objectArray);
  if (direction == "descending") {
    objectArray = objectArray.reverse();
  }

  // 根據 objectArray 的內容更新網頁
  let allInputs = document.querySelector(".all-input");

  // 清空內容
  allInputs.innerHTML = "";

  for (let i = 0; i < objectArray.length; i++) {
    allInputs.innerHTML += `<form>
    <div class="grader">
        <input
        type="text"
        placeholder="課別"
        class="class-type"
        list="opt"
        value=${objectArray[i].class_name}
        /><!--
        --><input
        type="text"
        placeholder="課別編號"
        class="class-number"
        value=${objectArray[i].class_number}
        /><!--
        --><input
        type="number"
        placeholder="學分"
        min="0"
        max="6"
        class="class-credit"
        value=${objectArray[i].class_credit}
        /><!--
        --><select name="select" class="select">
        <option value=""></option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="D-">D-</option>
        <option value="F">F</option></select
        ><!--
        --><button class="trash-button">
        <i class="fas fa-trash"></i>
        </button>
    </div>
    </form>`;
  }

  // SELECT 可直接用JS更改
  graders = document.querySelectorAll("div.grader");
  for (let i = 0; i < graders.length; i++) {
    graders[i].children[3].value = objectArray[i].class_grade;
  }

  // SELECT 事件監聽
  let allSelects = document.querySelectorAll("select");
  allSelects.forEach((select) => {
    changeSelectColor(select);
    select.addEventListener(EVENT.CHANGE, (e) => {
      setGPA();
      changeSelectColor(e.target);
    });
  });

  // 改變credit之後，GPA也要更新
  let credits = document.querySelectorAll(".class-credit");
  credits.forEach((credit) => {
    credit.addEventListener("change", () => {
      setGPA();
    });
  });
}

// 垃圾桶
let allTrash = document.querySelectorAll(".trash-button");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    e.target.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        e.target.remove();
        setGPA();
      }
    );
  });
});

let name = "joe"; 
let name2 = new String("joe"); // wrapper Object ，較耗記憶體
