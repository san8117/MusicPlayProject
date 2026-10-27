(() => {
  if (globalThis.location.protocol !== "file:") {
    return;
  }

  const showWarning = () => {
    const notice = document.createElement("p");
    notice.className = "environment-notice";
    notice.setAttribute("role", "status");
    notice.textContent = "Para usar o MUSICPLAY, abra o projeto em um servidor local (por exemplo, Live Server). Módulos JavaScript e vídeos incorporados não funcionam corretamente em file://.";
    document.body.prepend(notice);
  };

  if (document.body) {
    showWarning();
  } else {
    document.addEventListener("DOMContentLoaded", showWarning, { once: true });
  }
})();
