// ===== التحكم العام في اللعبة =====

function startGame() {
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  ScoreSystem.init();
}

function showTask(num) {
  document.querySelectorAll('.task').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.task-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('task' + num).classList.add('active');
  document.querySelectorAll('.task-btn')[num - 1].classList.add('active');
}

function resetGame() {
  if (confirm('هل أنت متأكد من إعادة اللعبة من البداية؟')) {
    ScoreSystem.reset();
    location.reload();
  }
}

function nextLevel() {
  alert('🚧 المستوى 2 (التصيّد الإلكتروني) قريباً!');
}

// تهيئة عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
  ScoreSystem.init();
});
