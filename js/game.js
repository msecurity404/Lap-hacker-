// ===== محرك اللعبة =====

const Game = {
  user: null,
  data: null,

  load() {
    const current = localStorage.getItem('cyberlab_current');
    if (!current) {
      location.href = 'index.html';
      return false;
    }
    const users = JSON.parse(localStorage.getItem('cyberlab_users') || '{}');
    if (!users[current]) {
      location.href = 'index.html';
      return false;
    }
    this.user = current;
    this.data = users[current];
    return true;
  },

  save() {
    const users = JSON.parse(localStorage.getItem('cyberlab_users') || '{}');
    users[this.user] = this.data;
    localStorage.setItem('cyberlab_users', JSON.stringify(users));
  },

  addXP(amount) {
    this.data.xp += amount;
    const newLevel = Math.floor(this.data.xp / 100) + 1;
    if (newLevel > this.data.level) {
      this.data.level = newLevel;
      this.showLevelUp(newLevel);
    }
    this.save();
    this.updateXPBar();
  },

  getRank() {
    const xp = this.data.xp;
    if (xp >= 500) return { name: '👑 أسطورة', color: 'var(--purple)' };
    if (xp >= 350) return { name: '🏆 خبير', color: 'var(--yellow)' };
    if (xp >= 200) return { name: '⭐ محترف', color: 'var(--blue)' };
    if (xp >= 100) return { name: '🔰 متدرب', color: 'var(--green)' };
    return { name: '🐣 مبتدئ', color: 'var(--text)' };
  },

  updateXPBar() {
    const bar = document.getElementById('xpFill');
    if (!bar) return;
    const currentLevelXP = (this.data.level - 1) * 100;
    const nextLevelXP = this.data.level * 100;
    const progress = ((this.data.xp - currentLevelXP) / 100) * 100;

    bar.style.width = Math.min(progress, 100) + '%';
    document.getElementById('levelBadge').textContent = 'Lv.' + this.data.level;
    document.getElementById('xpText').textContent = `${this.data.xp} / ${nextLevelXP} XP`;

    const rank = this.getRank();
    const rankEl = document.getElementById('userRankDisplay');
    if (rankEl) {
      rankEl.textContent = rank.name;
      rankEl.style.color = rank.color;
    }
  },

  showLevelUp(level) {
    const toast = document.createElement('div');
    toast.className = 'levelup-toast';
    toast.innerHTML = `🎉 ترقيت للمستوى ${level}!`;
    toast.style.cssText = `
      position:fixed; top:30px; left:50%; transform:translateX(-50%);
      background:var(--purple); color:white; padding:15px 30px;
      border-radius:12px; font-weight:700; z-index:9999;
      box-shadow:0 0 40px var(--purple); animation:slideIn .4s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.removeItem('cyberlab_current');
      location.href = 'index.html';
    }
  },

  // تُستدعى من dashboard
  initDashboard() {
    if (!this.load()) return;
    document.getElementById('userNameDisplay').textContent = this.user;
    document.getElementById('userAvatar').textContent = ['👨‍💻','👩‍💻','🕵️','🥷'][this.data.level % 4];
    this.updateXPBar();

    document.getElementById('statScore').textContent = this.data.xp;
    document.getElementById('statBadges').textContent = this.data.badges.length;
    document.getElementById('statTasks').textContent = this.data.completedMissions.length;
    document.getElementById('statRank').textContent = this.getRank().name;

    // تقدم المستوى 1
    const lvl1Done = this.data.completedMissions.filter(m => m.startsWith('lvl1_')).length;
    const pct = (lvl1Done / 4) * 100;
    const lvl1Progress = document.getElementById('lvl1Progress');
    if (lvl1Progress) lvl1Progress.style.width = pct + '%';
    const lvl1Status = document.getElementById('lvl1Status');
    if (lvl1Status) {
      if (lvl1Done === 4) lvl1Status.textContent = '✅ مكتمل';
      else if (lvl1Done > 0) lvl1Status.textContent = `${lvl1Done}/4 ▶ أكمل`;
      else lvl1Status.textContent = 'ابدأ ▶';
    }
  },

  initLevel() {
    if (!this.load()) return;
    this.updateXPBar();
    document.getElementById('liveScore').textContent = this.data.xp;
  },

  completeMission(missionId, xp) {
    if (this.data.completedMissions.includes(missionId)) return false;
    this.data.completedMissions.push(missionId);
    this.addXP(xp);
    this.save();
    document.getElementById('liveScore').textContent = this.data.xp;
    this.updateProgress();
    this.checkLevelComplete();
    return true;
  },

  updateProgress() {
    const fill = document.getElementById('progressFill');
    if (!fill) return;
    const done = this.data.completedMissions.filter(m => m.startsWith('lvl1_')).length;
    fill.style.width = (done / 4 * 100) + '%';
  },

  checkLevelComplete() {
    const done = this.data.completedMissions.filter(m => m.startsWith('lvl1_')).length;
    if (done === 4) {
      setTimeout(() => this.showFinalReport(), 800);
    }
  },

  showFinalReport() {
    const report = document.getElementById('finalReport');
    if (!report) return;
    report.classList.add('show');

    const rank = this.getRank();
    document.getElementById('reportRank').textContent = rank.name;
    document.getElementById('reportXP').textContent = this.data.xp;
    document.getElementById('reportTasks').textContent =
      this.data.completedMissions.filter(m => m.startsWith('lvl1_')).length + '/4';
    document.getElementById('reportBadges').textContent = this.data.badges.length;

    const total = this.data.stats.correct + this.data.stats.wrong;
    const acc = total > 0 ? Math.round((this.data.stats.correct / total) * 100) : 100;
    document.getElementById('reportAccuracy').textContent = acc + '%';

    let feedback = '';
    if (this.data.xp >= 300) feedback = '🌟 أداء ممتاز! أنت جاهز للمستوى التالي.';
    else if (this.data.xp >= 200) feedback = '👍 أداء جيد! استمر بالتدريب.';
    else feedback = '💪 جيد كبداية، راجع المهام وأعد المحاولة.';

    document.getElementById('reportFeedback').innerHTML = feedback +
      '<br><br>🎓 <b>الدرس المستفاد:</b> كلمة المرور القوية = 12 حرف+ مع رموز وأرقام وحروف كبيرة وصغيرة + 2FA.';

    report.scrollIntoView({ behavior: 'smooth' });
  },

  logout() {
    if (confirm('تسجيل الخروج؟')) {
      localStorage.removeItem('cyberlab_current');
      location.href = 'index.html';
    }
  }
};

// اختصارات عالمية
const logout = () => Game.logout();

// تشغيل حسب الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.dashboard')) Game.initDashboard();
  if (document.querySelector('.level-body')) Game.initLevel();
});
