// This web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyC4nUSEVVeaShtOdYHSMESvBlFJySeRmaE',
  authDomain: 'project-0809.firebaseapp.com',
  databaseURL: 'https://project-0809.firebaseio.com',
  projectId: 'project-0809',
  storageBucket: 'project-0809.appspot.com',
  messagingSenderId: '210546704019',
  appId: '1:210546704019:web:f6df6b88750bba0b725766'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const bmiData = db.ref('bmiData');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
renderData();

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
  bmiData.push({ height, weight, BMI, describe, DescribeKey, timestamp });
  calcWrapper.innerHTML = template.result(BMI, DescribeKey, describe);
}
function reset() {
  const calcWrapper = document.getElementById('calc-wrapper');
  calcWrapper.innerHTML = template.submitBtn();
  //reset value of inputs
  heightInput.value = null;
  weightInput.value = null;
}
function inputValidate(height, weight) {
  if (height > 0 && weight > 0) {
    return true;
  } else {
    alert('請輸入身高及體重');
    return false;
  }
}
function calcBMI(height, weight) {
  const BMI = weight / Math.pow(height / 100, 2);
  const { DescribeKey, describe } = analysis(BMI);
  return { BMI: BMI.toFixed(2), DescribeKey, describe };
}
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

function renderData() {
  bmiData.orderByChild('timestamp').on('value', snapshot => {
    const recordUl = document.getElementById('recordUl');
    const listArray = [];
    recordUl.innerHTML = '';
    // pre.innerHTML = JSON.stringify(snapshot.val(), null, 3);
    snapshot.forEach(item => {
      const date = new Date(item.val().timestamp);
      const dateString = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      const listItem = template.recordList(item.val(), dateString);
      listArray.push(listItem);
    });
    recordUl.innerHTML = listArray.reverse().join('');
  });
}

const template = {
  result: (BMI, DescribeKey, describe) => {
    return `<div class="result ${DescribeKey}">
          <div class="result-circle">
            <div class="bmi-wrapper">
              <span class="result-num">${BMI}</span>
              <span class="bmi-text">BMI</span>
            </div>
            <button id="reset" class="reset-btn" onclick="reset()">
              <img src="static/icon/icons_loop.png" alt="reset" />
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
