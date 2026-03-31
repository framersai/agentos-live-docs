if (typeof window !== 'undefined') {
  const installFlag = '__agentosNavbarEscapeHandlerInstalled';

  if (!window[installFlag]) {
    window[installFlag] = true;

    document.addEventListener('keydown', (event) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const openNavbar = document.querySelector('.navbar.navbar-sidebar--show');
      if (!(openNavbar instanceof HTMLElement)) {
        return;
      }

      const closeButton = openNavbar.querySelector('.navbar-sidebar__close');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    });
  }
}
