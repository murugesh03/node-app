// function greet(name) {
//   return `Hello, ${name}!`;
// }

// const PI = 3.14159;

// module.exports = greet; // Export a single fnction or vlaue
// module.exports = { greet, PI }; /// Export an object

// class User {
//   constructor(name, email) {
//     this.name = name;
//     this.email = email;
//   }
//   greet() {
//     return `Hello, ${this.name}!`;
//   }
// }

// module.exports = User;

//Using exports shorthand
// exports = {
//   add: () => {
//     return 5;
//   }
// }; //wrong logic wise syntax wise correct

exports.add = function (a, b) {
  return a + b;
};

//This is another way to export functions
module.exports.add = function (...params) {
  return params;
};
