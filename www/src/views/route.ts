import { createRouter } from '@nanostores/router';

export const router = createRouter({
  group: '/group',
  playground: '/playground',
});

router.subscribe((page) => {
  if (!page) {
    router.open('/playground', true);
    return;
  }
  activeSection(page.route);
  updateNavLinkActivity((route) => route.endsWith(page.route));
});

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
