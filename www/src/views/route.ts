import { atom } from 'nanostores';

const hrefAtom = atom(window.location.pathname);

function activeSection(id: string) {
  for (const section of document.querySelectorAll('section')) {
    if (section.id !== id) {
      section.classList.add('hidden');
    } else {
      section.classList.remove('hidden');
    }
  }
}

function updateNavLinkActivity(matcher: (route: string) => boolean) {
  for (const $a of document.querySelectorAll(
    'nav > a',
  ) as NodeListOf<HTMLAnchorElement>) {
    if (matcher($a.href)) {
      $a.classList.add('active');
    } else {
      $a.classList.remove('active');
    }
  }
}

hrefAtom.subscribe((value) => {
  switch (value) {
    case '/group': {
      activeSection('group');
      updateNavLinkActivity((route) => route.endsWith('group'));
      break;
    }
    default:
    case '/playground': {
      activeSection('playground');
      updateNavLinkActivity((route) => route.endsWith('playground'));
      break;
    }
  }
});
