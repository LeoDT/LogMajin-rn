module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: [
    '^(lodash-es|react|react-native)$',
    '<THIRD_PARTY_MODULES>',
    '^./i18n$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
  importOrderGroupNamespaceSpecifiers: false,
};
