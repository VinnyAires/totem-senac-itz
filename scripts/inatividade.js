function startInactivityTimer() {
  let timeout;

  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      window.location.href = '../index.html';
    }, 300000); // 5 minutos = 300000 ms
  }

  // Eventos que indicam atividade do usuário
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  window.addEventListener('scroll', resetTimer);
  window.addEventListener('touchstart', resetTimer);

  // Inicia o timer ao carregar
  resetTimer();
}

startInactivityTimer();


/*let inactivityTime = function () {
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function logout() { 
    window.location.href = '../index.html';
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 3000);
  }
};

inactivityTime();
*/