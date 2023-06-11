class Size {
  constructor(value) {
    this.shape = Array.isArray(value) ? [value.length] : [];
  }

  update_shape({
    dim = undefined,
    axis = 0,
    value_dim = null,
    flush = null,
  } = {}) {
    if (flush !== null) {
      flush.unshift(0);
      console.log(flush);
      this.shape.map((s, i) => {
        return s || flush[i];
      });
    }
    if (axis === 0) this.shape.push(value_dim !== null ? value_dim : dim);
    else this.shape[axis] = value_dim !== null ? value_dim : dim;

    if (this.parent) {
      this.parent.update_shape({
        dim: this.shape.slice(-1)[0],
        axis: axis + 1,
      });
    }
  }
}

class Tensor extends Size {
  constructor(
    value,
    { requires_grad = true, is_grad = false, parent = null, axes = 0 } = {}
  ) {
    if (
      typeof value !== "number" &&
      !Array.isArray(value) &&
      !(value instanceof Tensor)
    ) {
      console.error(value);
      console.error("Invalid value type");
      process.exit();
    }

    super(value);

    this.parent = parent;
    this.is_grad = is_grad;
    this.axes = 0;
    this.is_array = Array.isArray(value);
    this.grad = is_grad
      ? 0
      : new Tensor(this.is_array ? new Array() : 0, { is_grad: true }); //this.requires_grad ? 1 : 0;

    if (this.is_array && !is_grad) {
      this.axes++;
      if (this.parent) {
        this.parent.update_shape({ value_dim: value.length, axis: axes });
      }
      value = value.map((v, i) => {
        v =
          v instanceof Tensor
            ? v
            : new Tensor(v, { parent: this, axes: this.axes });
        this.grad.value[i] = v.grad;
        return v;
      });
    }

    this.value = value;

    this.backward = () => {};
    this.requires_grad = !is_grad && requires_grad;
  }

  add = (other) => {
    if (!(other instanceof Tensor)) other = new Tensor(other);

    let result,
      is_grad = this.is_grad || other.is_grad;

    if (other.is_array || this.is_array) {
      if (other.is_array && this.is_array) {
        // if(this.value.length !== other.value.length)

        throw new Error("Dimensions does not match");
      } else if (other.is_array && this.is_array) {
        result = new Tensor(
          this.value.map((v, i) => v.add(other.value[i])),
          { is_grad }
        );
      } else {
        if (!this.is_array && other.is_array) {
          result = new Tensor(
            other.value.map((v) => v.add(this)),
            { is_grad }
          );
        } else if (this.is_array && !other.is_array) {
          result = new Tensor(
            this.value.map((v) => v.add(other)),
            { is_grad }
          );
        }
      }
    } else if (!this.is_array && !other.is_array) {
      result = new Tensor(this.value + other.value, { is_grad });
    }
    result.backward = () => {
      this.grad = this.grad.add(result.grad);
      other.grad = other.grad.add(result.grad);

      this.backward();
      other.backward();
    };

    return result;
  };
}

let x = new Tensor([
  [
    [[2], [3]],
    [[3], [5]],
    [[4], [6]],
  ],
  [
    [[2], [5]],
    [[3], [5]],
    [[4], [2]],
  ],
]);
console.log(x.shape);
console.log(x, x.value[1]);

// let y = x.add(new Tensor([x, x, x]));
// y.grad = 1;

// y.backward();
// console.log(x.grad, "x_grad");
// console.log(y.value, y.value[1]);
