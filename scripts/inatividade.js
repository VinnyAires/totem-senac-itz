let inactivityTime = function () {
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function logout() { 
    window.location.href = '../index.html';
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 300000);
  }
};

inactivityTime();