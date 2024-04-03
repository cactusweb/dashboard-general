// declare global {
//   interface String {
//     replaceAll(searchValue: string, replaceValue: string): string;
//   }
// }

// String.prototype.replaceAll = function (
//   this: string,
//   searchValue: string,
//   replaceValue: string
// ) {
//   let s = this;
//   while (s.includes(searchValue)) {
//     s = s.replace(searchValue, replaceValue);
//   }
//   return s;
// };
