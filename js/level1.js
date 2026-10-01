// ===== المستوى 1: كلمات المرور =====

// ----- المهمة 1: تصنيف -----
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
let task1Solved = 0;

function renderPasswords() {
  const c = document.getElementById('passwordList');
  if (!c) return;
  c.innerHTML = '';
  passwords.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'password-item';
    div.innerHTML = `
      <span class="password-value">${p.value}</span>
      <div class="password-options">
        <button class="pwd-btn weak" onclick="classifyPwd(${i},'weak')">ضعيفة</button>
        <button class="pwd-btn medium" onclick="classifyPwd(${i},'medium')">متوسطة</button>
        <button class="pwd-btn strong" onclick="classifyPwd(${i},'strong')">قوية</button>
      </div>`;
    c.appendChild(div);
  });
}

function classifyPwd(i, choice) {
  const p = passwords[i];
  const item = document.querySelectorAll('.password-item')[i];
  const btns = item.querySelectorAll('.pwd-btn');
  btns.forEach(b => b.disabled = true);

  if (choice === p.correct) {
    item.querySelector(`.pwd-btn.${choice}`).classList.add('correct');
    item.classList.add('solved');
    Game.data.stats.correct++;
    task1Solved++;
    document.getElementById('mission1Status').textContent = `✅ صحيح! (${task1Solved}/${passwords.length})`;
    document.getElementById('mission1Status').style.color = 'var(--green)';

    if (task1Solved === passwords.length) {
      Game.data.badges.push({ id: 'hunter', name: '🔰 صيّاد الحسابات' });
      Game.completeMission('lvl1_task1', 80);
      document.querySelector('[data-mission="1"]').classList.add('completed');
      document.getElementById('mission1Status').textContent = '🏆 المهمة مكتملة! +80 XP';
    }
  } else {
    item.querySelector(`.pwd-btn.${choice}`).classList.add('wrong');
    item.querySelector(`.pwd-btn.${p.correct}`).classList.add('correct');
    Game.data.stats.wrong++;
    document.getElementById('mission1Status').textContent = '❌ خطأ — راجع الإجابة الصحيحة';
    document.getElementById('mission1Status').style.color = 'var(--red)';
  }
  Game.save();
}

// ----- المهمة 2: تحليل قوة -----
function analyzePassword() {
  const pwd = document.getElementById('pwdTest').value;
  const fill = document.getElementById('strengthFill');
  const results = document.getElementById('analysisResults');
  const tips = document.getElementById('pwdTips');

  if (!pwd) {
    fill.style.width = '0%';
    results.style.display = 'none';
    tips.style.display = 'none';
    return;
  }

  results.style.display = 'grid';

  let score = 0;
  const checks = {
    length8: pwd.length >= 8,
    length12: pwd.length >= 12,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    digit: /[0-9]/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
    noCommon: !['123456','password','qwerty','admin','iloveyou'].includes(pwd.toLowerCase())
  };
  Object.values(checks).forEach(v => v && score++);

  const percent = (score / 7) * 100;
  fill.style.width = percent + '%';

  let label, color, time, tipsArr = [];
  if (score <= 2) {
    label = '⚠️ ضعيفة جداً'; color = 'var(--red)'; time = '< 1 ثانية';
    tipsArr.push('❌ أضف أحرف كبيرة وأرقام ورموز');
    tipsArr.push('❌ اجعلها 12 حرف على الأقل');
  } else if (score <= 4) {
    label = '🟡 متوسطة'; color = 'var(--yellow)'; time = 'ساعات إلى أيام';
    tipsArr.push('⚠️ استخدم رموز (@, #, $)');
    tipsArr.push('⚠️ تجنب الكلمات الشائعة');
  } else if (score === 5) {
    label = '🟢 قوية'; color = 'var(--green)'; time = 'سنوات';
    tipsArr.push('✅ جيدة! زد الطول لقوة أكبر');
  } else {
    label = '🔒 قوية جداً'; color = 'var(--green)'; time = 'ملايين السنين';
    tipsArr.push('🎉 ممتازة! هذه كلمة مرور احترافية');
  }

  fill.style.background = color;
  document.getElementById('resStrength').textContent = label;
  document.getElementById('resStrength').style.color = color;
  document.getElementById('resLength').textContent = pwd.length + ' حرف';
  document.getElementById('resVariety').textContent = `${Object.values(checks).filter(v=>v).length}/7`;
  document.getElementById('resTime').textContent = time;

  tips.style.display = 'block';
  tips.innerHTML = tipsArr.join('<br>');

  // عند الوصول لكلمة قوية جداً
  if (score >= 6 && !Game.data.completedMissions.includes('lvl1_task2')) {
    Game.data.badges.push({ id: 'guardian', name: '🛡️ حامي الحساب' });
    Game.completeMission('lvl1_task2', 60);
    document.querySelector('[data-mission="2"]').classList.add('completed');
  }
}

// ----- المهمة 3: هجوم القاموس -----
const dictionary = [
  '123456','password','12345678','qwerty','123456789','12345','1234','111111','1234567','dragon',
  '123123','baseball','abc123','football','monkey','letmein','696969','shadow','master','666666',
  'qwertyuiop','123321','mustang','1234567890','michael','654321','pussy','superman','1qaz2wsx','7777777',
  'fuckyou','121212','000000','qazwsx','123qwe','killer','trustno1','jordan','jennifer','zxcvbnm',
  'asdfgh','hunter','buster','soccer','harley','batman','andrew','tigger','sunshine','iloveyou',
  '2000','charlie','robert','thomas','hockey','ranger','daniel','starwars','klaster','112233',
  'george','asshole','computer','michelle','jessica','pepper','1111','zxcvbn','555555','11111111',
  '131313','freedom','777777','pass','fuck','maggie','159753','aaaaaa','ginger','princess',
  'joshua','cheese','amanda','summer','love','ashley','nicole','chelsea','biteme','matthew',
  'access','yankees','987654321','dallas','austin','thunder','taylor','matrix','admin','admin123'
];

function startDictionaryAttack() {
  const target = document.getElementById('targetPwd').value;
  const term = document.getElementById('attackTerminal');
  const btn = event.target;
  btn.disabled = true;
  term.innerHTML = '';

  logTerm(`> [INIT] بدء هجوم Dictionary Attack على الهدف...`);
  logTerm(`> [INFO] حجم القاموس: ${dictionary.length} كلمة`);
  logTerm(`> [INFO] كلمة المرور المستهدفة: ${'*'.repeat(target.length)} (${target.length} حرف)`);
  logTerm(`> [EXEC] جاري التجريب...`);
  logTerm('');

  let i = 0;
  let found = false;
  const startTime = Date.now();

  const interval = setInterval(() => {
    if (i >= dictionary.length) {
      clearInterval(interval);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      if (!found) {
        logTerm(`> [DONE] ❌ فشل الاختراق خلال ${elapsed}s`, 'err');
        logTerm(`> [RESULT] كلمة المرور قوية 👏`, 'ok');
        if (!Game.data.completedMissions.includes('lvl1_task3')) {
          Game.data.badges.push({ id: 'defender', name: '🛡️ المدافع' });
          Game.completeMission('lvl1_task3', 100);
          document.querySelector('[data-mission="3"]').classList.add('completed');
        }
      }
      btn.disabled = false;
      return;
    }

    const guess = dictionary[i];
    const display = guess.length > 15 ? guess.slice(0, 15) + '...' : guess;
    logTerm(`  [${String(i+1).padStart(3,'0')}] محاولة: ${display}`);

    if (guess === target) {
      found = true;
      clearInterval(interval);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      logTerm('');
      logTerm(`> [!!!] 🔓 تم اختراق الحساب بنجاح!`, 'err');
      logTerm(`> [PASS] كلمة المرور: ${target}`, 'err');
      logTerm(`> [TIME] استغرقت العملية: ${elapsed} ثانية`, 'warn');
      logTerm(`> [WARN] ⚠️ هكذا يشعر ضحيتك الآن`, 'warn');
      logTerm('');
      logTerm(`> [LESSON] 💡 استخدم كلمة مرور غير موجودة في القواميس`, 'ok');

      if (!Game.data.completedMissions.includes('lvl1_task3')) {
        Game.data.badges.push({ id: 'attacker', name: '⚔️ الهاكر' });
        Game.completeMission('lvl1_task3', 100);
        document.querySelector('[data-mission="3"]').classList.add('completed');
      }
      btn.disabled = false;
      return;
    }
    i++;
  }, 80);
}

function logTerm(text, type = '') {
  const term = document.getElementById('attackTerminal');
  const p = document.createElement('div');
  p.className = 'term-line ' + type;
  p.textContent = text;
  term.appendChild(p);
  term.scrollTop = term.scrollHeight;
}

// ----- المهمة 4: OTP -----
let currentOTP = null, otpInterval = null;

function requestOTP() {
  const u = document.getElementById('simUser').value;
  const p = document.getElementById('simPass').value;
  if (!u || !p) return alert('⚠️ أدخل اسم المستخدم وكلمة المرور');

  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
  document.getElementById('otpBox').style.display = 'block';
  document.getElementById('otpCode').textContent = currentOTP;
  document.getElementById('otpInput').value = '';

  let timeLeft = 30;
  document.getElementById('otpTimer').textContent = `⏱️ الوقت المتبقي: ${timeLeft}s`;

  clearInterval(otpInterval);
  otpInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('otpTimer').textContent = `⏱️ الوقت المتبقي: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(otpInterval);
      document.getElementById('otpBox').style.display = 'none';
      const s = document.getElementById('mission4Status');
      s.textContent = '❌ انتهى الوقت! حاول مرة أخرى';
      s.style.color = 'var(--red)';
    }
  }, 1000);
}

function verifyOTP() {
  const input = document.getElementById('otpInput').value;
  const s = document.getElementById('mission4Status');

  if (input === currentOTP) {
    clearInterval(otpInterval);
    s.textContent = '✅ تم التحقق! حتى لو سُرقت كلمة المرور، الحساب محمي بـ 2FA';
    s.style.color = 'var(--green)';
    document.getElementById('otpBox').style.display = 'none';

    if (!Game.data.completedMissions.includes('lvl1_task4')) {
      Game.data.badges.push({ id: 'otpMaster', name: '🔐 خبير 2FA' });
      Game.completeMission('lvl1_task4', 60);
      document.querySelector('[data-mission="4"]').classList.add('completed');
    }
  } else {
    s.textContent = '❌ رمز خاطئ!';
    s.style.color = 'var(--red)';
  }
}

// تهيئة
document.addEventListener('DOMContentLoaded', () => {
  renderPasswords();
  if (Game.load()) {
    // استرجاع حالة المهام المنجزة
    if (Game.data.completedMissions.includes('lvl1_task1')) {
      document.querySelector('[data-mission="1"]').classList.add('completed');
    }
    if (Game.data.completedMissions.includes('lvl1_task2')) {
      document.querySelector('[data-mission="2"]').classList.add('completed');
    }
    if (Game.data.completedMissions.includes('lvl1_task3')) {
      document.querySelector('[data-mission="3"]').classList.add('completed');
    }
    if (Game.data.completedMissions.includes('lvl1_task4')) {
      document.querySelector('[data-mission="4"]').classList.add('completed');
    }
    Game.updateProgress();
    if (Game.data.completedMissions.filter(m => m.startsWith('lvl1_')).length === 4) {
      setTimeout(() => Game.showFinalReport(), 1000);
    }
  }
});
