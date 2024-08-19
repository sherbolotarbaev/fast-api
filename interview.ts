// EVENT LOOP
// setTimeout(() => console.log('Hello setTimeout'), 0); // 4
// process.nextTick(() => console.log('Hello nextTick')); // 2
// Promise.resolve().then(() => console.log('Hello Promise')); // 3
// console.log('Hello console.log'); // 1
// setImmediate(() => console.log('Hello setImmediate')); // 6
// setTimeout(() => console.log('Hello setTimeout 2'), 0); // 5

// class SomeClass {
//   b() {
//     return () => {
//       console.log(this);
//     };
//   }

//   a() {
//     console.log(this);
//   }
// }

// const someClass = new SomeClass();
// console.log(someClass.a());
// console.log(someClass.b());

let arr: any = [1, 2, 3, 4, 5, 6];
arr.foo = 'Hello';
arr.push(7);
for (const obj in arr) {
  console.log(obj, 'in');
}
for (const obj of arr) {
  console.log(obj, 'of');
}
