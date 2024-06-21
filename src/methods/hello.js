module.exports = hello;

function hello (from) {
  if (from == null) return 'Who are you?';
  return `Hello ${from}!`;
}
