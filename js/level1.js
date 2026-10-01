// ===== المستوى الأول: كلمات المرور =====

// --- المهمة 1: تصنيف كلمات المرور ---
const passwords = [
  { value: '123456', correct: 'weak' },
  { value: 'password', correct: 'weak' },
  { value: 'ahmad2010', correct: 'medium' },
  { value: 'P@ssw0rd!2024', correct: 'strong' },
  { value: 'iloveyou', correct: 'weak' },
  { value: 'X7#kL9$mQ2!', correct: 'strong' },
  { value: 'qwerty123', correct: 'weak' },
  { value: 'MyDog@2023', correct: 'medium' }
];

let task1Done = 0;

function renderPasswords() {
  const container = document.getElementById('passwordList');
  container.innerHTML = '';
  passwords.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'password-item';
    div.innerHTML = `
      <span class="password-value">${p.value}</span>
      <div class="password-options">
        <button class="pwd-btn weak" onclick="classify(${i}, 'weak')">ضعيفة</button>
        <button class="pwd-btn medium" onclick="classify(${i}, 'medium')">متوسطة</button>
        <button class="pwd-btn strong" onclick="classify(${i}, 'strong')">قوية</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function classify(index, choice) {
  const p = passwords[index];
  const item = document.querySelectorAll('.password-item')[index];
  const buttons = item.querySelectorAll('.pwd-btn');
  buttons.forEach(b => b.disabled = true);

  if (choice === p.correct) {
    item.querySelector(`.pwd-btn.${choice}`).classList.add('correct');
    ScoreSystem.addScore(10);
    task1Done++;
    document.getElementById('task1Status').textContent =
      `✅ صحيح! (${task1Done}/${passwords.length})`;
    document.getElementById('task1Status').style.color = 'var(--green)';

    if (task1Done === passwords.length) {
      ScoreSystem.addBadge('hunter', '🔰 مبتدئ واعي');
      ScoreSystem.completeTask('task1');
      document.getElementById('task1Status').textContent =
        '🏆 أكملت المهمة! +80 نقطة';
    }
  } else {
    item.querySelector(`.pwd-btn.${choice}`).classList.add('wrong');
    item.querySelector(`.pwd-btn.${p.correct}`).classList.add('correct');
    document.getElementById('task1Status').textContent = '❌ خطأ، شوف الإجابة الصحيحة';
    document.getElementById('task1Status').style.color = 'var(--red)';
  }
}

// --- المهمة 2: مقياس القوة ---
function checkPassword() {
  const pwd = document.getElementById('pwdInput').value;
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  const crack = document.getElementById('crackTime');

  if (!pwd) {
    fill.style.width = '0%';
    text.textContent = '';
    crack.textContent = '';
    return;
  }

  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const percent = (score / 6) * 100;
  fill.style.width = percent + '%';

  let label, color, time;
  if (score <= 2) {
    label = '⚠️ ضعيفة جداً';
    color = 'var(--red)';
    time = '⏱️ تُكسر فوراً (Instant)';
  } else if (score <= 4) {
    label = '🟡 متوسطة';
    color = 'var(--yellow)';
    time = '⏱️ تُكسر في ساعات';
  } else if (score === 5) {
    label = '🟢 قوية';
    color = 'var(--green)';
    time = '⏱️ تُكسر في سنوات';
  } else {
    label = '🔒 قوية جداً';
    color = 'var(--green)';
    time = '⏱️ تحتاج ملايين السنين';
  }

  fill.style.background = color;
  text.textContent = label;
  text.style.color = color;
  crack.textContent = time;

  if (score >= 5 && !ScoreSystem.completedTasks.includes('task2')) {
    ScoreSystem.addScore(20);
    ScoreSystem.addBadge('guardian', '🛡️ حامي الحساب');
    ScoreSystem.completeTask('task2');
  }
}

// --- المهمة 3: هجوم القاموس ---
const dictionary = [
  '123456', 'password', 'qwerty', 'admin', 'letmein',
  'welcome', 'monkey', 'dragon', 'iloveyou', 'football',
  'ahmad', 'sara', 'jordan', '12345678', 'abc123'
];

function runBruteForce() {
  const target = document.getElementById('victimPwd').value;
  const log = document.getElementById('attackLog');
  log.innerHTML = '';
  let i = 0;

  log.innerHTML += `<p>> بدء الهجوم على كلمة المرور: ${'*'.repeat(target.length)}</p>`;
  log.innerHTML += `<p>> تحميل القاموس (${dictionary.length} كلمة)...</p>`;

  const interval = setInterval(() => {
    if (i >= dictionary.length) {
      clearInterval(interval);
      log.innerHTML += `<p class="err">❌ فشل الهجوم! كلمة المرور قوية 👏</p>`;
      log.scrollTop = log.scrollHeight;
      return;
    }

    const guess = dictionary[i];
    log.innerHTML += `<p>محاولة ${i + 1}: ${guess}</p>`;
    log.scrollTop = log.scrollHeight;

    if (guess === target) {
      clearInterval(interval);
      log.innerHTML += `<p class="err">🔓 تم الاختراق! كلمة المرور: ${target}</p>`;
      log.innerHTML += `<p class="err">⚠️ هكذا يشعر ضحيتك</p>`;

      if (!ScoreSystem.completedTasks.includes('task3')) {
        ScoreSystem.addScore(25);
        ScoreSystem.addBadge('botHunter', '⚔️ صيّاد البوتات');
        ScoreSystem.completeTask('task3');
      }
    }

    i++;
  }, 300);
}

// --- المهمة 4: OTP ---
let currentOTP = null;
let otpTimerInterval = null;

function requestOTP() {
  const user = document.getElementById('loginUser').value;
  const pwd = document.getElementById('loginPwd').value;

  if (!user || !pwd) {
    alert('⚠️ أدخل اسم المستخدم وكلمة المرور');
    return;
  }

  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
  document.getElementById('otpSection').style.display = 'block';
  document.getElementById('otpCode').textContent = currentOTP;

  let timeLeft = 30;
  const timerEl = document.getElementById('otpTimer');
  timerEl.textContent = `⏱️ الوقت المتبقي: ${timeLeft}s`;

  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ الوقت المتبقي: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('otpSection').style.display = 'none';
      document.getElementById('task4Status').textContent = '❌ انتهى الوقت! حاول مرة أخرى';
      document.getElementById('task4Status').style.color = 'var(--red)';
    }
  }, 1000);
}

function verifyOTP() {
  const input = document.getElementById('otpInput').value;
  const status = document.getElementById('task4Status');

  if (input === currentOTP) {
    clearInterval(otpTimerInterval);
    status.textContent = '✅ تم التحقق! حتى لو سرقت كلمة المرور، الحساب محمي';
    status.style.color = 'var(--green)';
    document.getElementById('otpSection').style.display = 'none';

    if (!ScoreSystem.completedTasks.includes('task4')) {
      ScoreSystem.addScore(25);
      ScoreSystem.addBadge('otpMaster', '🔐 خبير 2FA');
      ScoreSystem.completeTask('task4');
    }
  } else {
    status.textContent = '❌ رمز خاطئ!';
    status.style.color = 'var(--red)';
  }
}

// --- التهيئة ---
document.addEventListener('DOMContentLoaded', () => {
  renderPasswords();
});
