import Tensor from "./Tensor";
import { display } from "./utils";

let x = new Tensor([
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
]);
// display(x, new Array("shape", "axes"));
console.log(x.shape, "X shape");
// console.log(x);

// let y = x.add(new Tensor([x, x, x]));
// y.grad = 1;

// y.backward();
// console.log(x.grad, "x_grad");
// console.log(y.value, y.value[1]);
