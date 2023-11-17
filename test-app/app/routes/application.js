import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  model() {
    return {
      links: [
        {
          href: 'https://github.com/shipshapecode/ember-flatpickr',
          text: 'Docs',
          type: 'href',
        },
        {
          href: 'https://github.com/shipshapecode/ember-flatpickr',
          text: 'GitHub',
          type: 'href',
        },
        {
          href: 'https://shipshape.io',
          text: 'Ship Shape',
          type: 'href',
        },
      ],
    };
  }
}
