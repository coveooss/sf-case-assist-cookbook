module.exports = {
  trailingComma: 'none',
  overrides: [
    {
      files: '**/lwc/**/*.html',
      options: {
        parser: 'lwc'
      }
    },
    {
      files: '*.{cmp,page,component}',
      options: {
        parser: 'html'
      }
    },
    {
      files: ['**/*.js'],
      options: {
        singleQuote: true
      }
    },
    {
      files: ['**/*.json'],
      options: {
        tabWidth: 2
      }
    },
    {
      files: ['**/*.xml', '**/*.cls'],
      options: {
        tabWidth: 4
      }
    }
  ]
};
