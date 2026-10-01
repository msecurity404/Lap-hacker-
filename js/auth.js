// ===== نظام المصادقة =====

function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(tab + 'Form').classList.add('active');
}

function hashPassword(pwd) {
  // hash بسيط (للأمان الحقيقي استخدم bcrypt على سيرفر)
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    hash = ((hash << 5) - hash) + pwd.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16);
}

function register() {
  const user = document.getElementById('regUser').value.trim();
  const pass = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  const err = document.getElementById('registerError');

  err.textContent = '';

  if (user.length < 3) return err.textContent = '❌ الاسم قصير جداً (3 أحرف+)';
  if (pass.length < 6) return err.textContent = '❌ كلمة المرور ضعيفة (6 أحرف+)';
  if (pass !== pass2) return err.textContent = '❌ كلمتا المرور غير متطابقتين';

  const users = JSON.parse(localStorage.getItem('cyberlab_users') || '{}');
  if (users[user]) return err.textContent = '❌ الاسم مستخدم';

  users[user] = {
    password: hashPassword(pass),
    createdAt: Date.now(),
    xp: 0,
    level: 1,
    badges: [],
    completedMissions: [],
    stats: { correct: 0, wrong: 0 }
  };

  localStorage.setItem('cyberlab_users', JSON.stringify(users));
  err.style.color = 'var(--green)';
  err.textContent = '✅ تم إنشاء الحساب! جاري الدخول...';

  setTimeout(() => {
    localStorage.setItem('cyberlab_current', user);
    location.href = 'dashboard.html';
  }, 800);
}

function login() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  err.textContent = '';

  const users = JSON.parse(localStorage.getItem('cyberlab_users') || '{}');
  if (!users[user]) return err.textContent = '❌ الحساب غير موجود';
  if (users[user].password !== hashPassword(pass)) return err.textContent = '❌ كلمة المرور خاطئة';

  localStorage.setItem('cyberlab_current', user);
  err.style.color = 'var(--green)';
  err.textContent = '✅ مرحباً ' + user + '!';
  setTimeout(() => location.href = 'dashboard.html', 500);
}

// إذا المستخدم مسجل دخول مسبقاً → انتقل مباشرة
if (localStorage.getItem('cyberlab_current')) {
  const users = JSON.parse(localStorage.getItem('cyberlab_users') || '{}');
  if (users[localStorage.getItem('cyberlab_current')]) {
    location.href = 'dashboard.html';
  }
}
