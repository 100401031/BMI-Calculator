const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
var bmiData;

//樣板字串
const template = {
  result: (BMI, DescribeKey, describe) => {
    return `<div class="result ${DescribeKey}">
          <div class="result-circle">
            <div class="bmi-wrapper">
              <span class="result-num">${BMI}</span>
              <span class="bmi-text">BMI</span>
            </div>
            <button id="reset" class="reset-btn" onclick="reset()">
              <img src="static/img/icon/icons_loop.png" alt="reset" />
            </button>
          </div>
          <div class="result-text">${describe}</div>
        </div>`;
  },
  submitBtn: () => {
    return `<button id="submit" class="submit-btn" onclick="submit()">看結果</button>`;
  },
  recordList: ({ height, weight, BMI, describe, DescribeKey }, dateString) => {
    return `<li class="record-li ${DescribeKey}">
    <span class="main-text">${describe}</span>
    <span>
      <span class="label">BMI</span>
      <span class="main-text">${BMI}</span>
    </span>
    <span>
      <span class="label">weight</span>
      <span class="main-text">${weight}kg</span>
    </span>
    <span>
      <span class="label">height</span>
      <span class="main-text">${height}cm</span>
    </span>
    <span class="date">${dateString}</span>
  </li>`;
  }
};

//init rendering
renderData();

//處理提交行為
function submit() {
  const calcWrapper = document.getElementById('calc-wrapper');
  const height = heightInput.value;
  const weight = weightInput.value;
  if (!inputValidate(height, weight)) {
    return;
  }
  const { BMI, describe, DescribeKey } = calcBMI(height, weight);
  if (BMI > 99 || BMI < 1) {
    alert('請輸入合理數值');
    return;
  }
  const timestamp = new Date().getTime();
  const storedData = { height, weight, BMI, describe, DescribeKey, timestamp };
  const newUuid = _uuid();
  bmiData[newUuid] = storedData;
  localStorage.setItem('bmiData', JSON.stringify(bmiData));
  renderData();
  calcWrapper.innerHTML = template.result(BMI, DescribeKey, describe);
}

//處理重置行為
function reset() {
  const calcWrapper = document.getElementById('calc-wrapper');
  calcWrapper.innerHTML = template.submitBtn();
  //reset value of inputs
  heightInput.value = null;
  weightInput.value = null;
}

//驗證身高及體重是否大於0
function inputValidate(height, weight) {
  if (height > 0 && weight > 0) {
    return true;
  } else {
    alert('請輸入身高及體重');
    return false;
  }
}
//計算BMI值
function calcBMI(height, weight) {
  const BMI = weight / Math.pow(height / 100, 2);
  const { DescribeKey, describe } = analysis(BMI);
  return { BMI: BMI.toFixed(2), DescribeKey, describe };
}
//解析BMI值結果
function analysis(BMI) {
  if (BMI < 18.5) {
    return { DescribeKey: 'underWeight', describe: '過輕' };
  } else if (BMI >= 18.5 && BMI < 24) {
    return { DescribeKey: 'ideal', describe: '理想' };
  } else if (BMI >= 24 && BMI < 27) {
    return { DescribeKey: 'overWeight', describe: '過重' };
  } else if (BMI >= 27 && BMI < 30) {
    return { DescribeKey: 'mildObesity', describe: '輕度肥胖' };
  } else if (BMI >= 30 && BMI < 35) {
    return { DescribeKey: 'moderateObesity', describe: '中度肥胖' };
  } else if (BMI >= 35) {
    return { DescribeKey: 'severeObesity', describe: '重度肥胖' };
  }
}

//將資料render進DOM元素
function renderData() {
  bmiData = JSON.parse(localStorage.getItem('bmiData')) || {};
  const recordUl = document.getElementById('recordUl');
  const listArray = [];
  recordUl.innerHTML = '';
  for (var key in bmiData) {
    const date = new Date(bmiData[key].timestamp);
    const dateString = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    const listItem = template.recordList(bmiData[key], dateString);
    listArray.push(listItem);
  }
  recordUl.innerHTML = listArray.reverse().join('');
}

//產生uuid
function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
