// ===== نظام النقاط والشارات =====

const ScoreSystem = {
  score: 0,
  badges: [],
  completedTasks: [],

  init() {
    const saved = localStorage.getItem('cyberlab_save');
    if (saved) {
      const data = JSON.parse(saved);
      this.score = data.score || 0;
      this.badges = data.badges || [];
      this.completedTasks = data.completedTasks || [];
    }
    this.updateUI();
  },

  addScore(points) {
    this.score += points;
    this.save();
    this.updateUI();
  },

  addBadge(badgeId, badgeName) {
    if (!this.badges.find(b => b.id === badgeId)) {
      this.badges.push({ id: badgeId, name: badgeName });
      this.save();
      this.updateUI();
    }
  },

  completeTask(taskId) {
    if (!this.completedTasks.includes(taskId)) {
      this.completedTasks.push(taskId);
      this.save();
    }
    this.updateProgress();
  },

  updateUI() {
    document.getElementById('scoreDisplay').textContent = this.score;
    document.getElementById('badgesDisplay').textContent = this.badges.length;
    const preview = document.getElementById('previewScore');
    if (preview) preview.textContent = this.score;
    const previewBadges = document.getElementById('previewBadges');
    if (previewBadges) previewBadges.textContent = this.badges.length;
    this.updateProgress();
  },

  updateProgress() {
    const total = 4;
    const done = this.completedTasks.length;
    const percent = (done / total) * 100;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = percent + '%';

    if (done === total) {
      setTimeout(() => {
        document.getElementById('victoryScreen').classList.add('show');
        this.addBadge('master1', '👑 Master Level 1');
      }, 500);
    }
  },

  save() {
    localStorage.setItem('cyberlab_save', JSON.stringify({
      score: this.score,
      badges: this.badges,
      completedTasks: this.completedTasks
    }));
  },

  reset() {
    this.score = 0;
    this.badges = [];
    this.completedTasks = [];
    localStorage.removeItem('cyberlab_save');
    this.updateUI();
  }
};
