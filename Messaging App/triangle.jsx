const Triangle = (props) => {
  return (
    <div
      style={{
        content: "" /* triangle */,
        position: "relative",
        bottom: "-15px" /* value = - border-top-width - border-bottom-width */,
        left: `${props.alignTriangle}` /* controls horizontal position */,
        borderWidth:
          "15px 15px 0" /* vary these values to change the angle of the vertex */,
        borderStyle: "solid",
        borderColor: `${props.color} transparent`,
      }}
    />
  );
};
export default Triangle;
