export default {
  editor: {
    label: { en: 'Public Testimonials' },
    icon: 'star',
    categories: ['content'],
  },
  triggerEvents: [
    {
      name: 'testimonials:loaded',
      label: { en: 'On Testimonials Loaded' },
      event: { count: 0 },
    },
    {
      name: 'testimonials:error',
      label: { en: 'On Error' },
      event: { message: '' },
    },
  ],
  properties: {
    supabaseUrl: {
      label: { en: 'Supabase URL' },
      type: 'Text',
      bindable: true,
      hidden: true,
      defaultValue: '',
    },
    supabaseAnonKey: {
      label: { en: 'Supabase Anon Key' },
      type: 'Text',
      bindable: true,
      hidden: true,
      defaultValue: '',
    },
    heading: {
      label: { en: 'Heading' },
      type: 'Text',
      bindable: true,
      defaultValue: 'What our members say',
    },
    subheading: {
      label: { en: 'Subheading' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Real reviews from real members across Australia.',
    },
    limit: {
      label: { en: 'Max Reviews' },
      type: 'Number',
      defaultValue: 9,
      options: { min: 1, max: 50 },
    },
    columns: {
      label: { en: 'Columns (desktop)' },
      type: 'TextSelect',
      options: {
        options: [
          { value: '2', label: { en: '2 columns' } },
          { value: '3', label: { en: '3 columns' } },
          { value: '4', label: { en: '4 columns' } },
        ],
      },
      defaultValue: '3',
    },
    portalTarget: {
      label: { en: 'Portal Target' },
      type: 'Text',
      bindable: true,
      hidden: true,
      defaultValue: '',
    },
    /* wwEditor:start */
    bindingValidation: {
      limit:   { type: 'number', tooltip: 'Number of reviews to display (1-50)' },
      columns: { type: 'string', tooltip: '2 | 3 | 4' },
    },
    /* wwEditor:end */
  },
};
