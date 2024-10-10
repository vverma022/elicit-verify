// @ts-ignore
import styled from "styled-components";
import React from "react";

// Define interface for props
interface MarginProps {
  margin: string | number;
  direction?: "horizontal" | "vertical";
}

const HorizontalMargin = styled.span<MarginProps>`
  display: flex;
  width: ${({ margin }) =>
    typeof margin === "string" ? margin : `${margin}px`};
`;

const VerticalMargin = styled.span<MarginProps>`
  display: flex;
  height: ${({ margin }) =>
    typeof margin === "string" ? margin : `${margin}px`};
`;

// Define the type for the functional component props
const Marginer: React.FC<MarginProps> = (props) => {
  const { direction } = props;

  if (direction === "horizontal") return <HorizontalMargin {...props} />;
  else {
    return <VerticalMargin {...props} />;
  }
};

Marginer.defaultProps = {
  direction: "horizontal",
};

export { Marginer };