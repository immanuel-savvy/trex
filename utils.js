import Tensor from "./Tensor";

const display = (
  object,
  props_of_interest,
  { tabs = 0, is_array = false, return_render = false } = {}
) => {
  if (!(object instanceof Tensor)) {
    if (Array.isArray(object)) {
      is_array = true;
    }
    return object;
  }
  let render = is_array ? [] : {};

  if (!props_of_interest) return object;
  if (!Array.isArray(props_of_interest))
    props_of_interest = new Array(props_of_interest);

  for (let i = 0; i < props_of_interest.length; i++) {
    let prop = props_of_interest[i];

    if (is_array)
      render.push(display(object[prop], null, { return_render: true }));
    else render[prop] = display(object[prop], null, { return_render: true });

    // if (object.value)
    //   render["value"] = display(object.value, props_of_interest, {
    //     return_render: true,
    //   });
  }

  if (return_render) return render;

  console.log(JSON.stringify(render, null, 2));
};

export { display };
