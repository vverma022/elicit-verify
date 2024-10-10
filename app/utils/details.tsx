// @ts-ignore

import styled from "styled-components";
import { Marginer } from "./marginer";
import NikeImg from "../assets/elicit .jpg";

const DetailsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2.5em 6px 0 6px;
  line-height: 1.4;
  background-color: #000; /* Black background */
  color: #ff0000; /* Red text color */
  text-align: center; /* Centering text */
`;

const MediumText = styled.span`
  font-size: 18px;
  color: #ff0000; /* Red text color */
  font-weight: 800;
  text-transform: uppercase;
  text-align: center; /* Center text */
`;

const SmallText = styled.span`
  font-size: 11px;
  color: #ff0000; /* Red text color */
  font-weight: 700;
  text-transform: uppercase;
  text-align: center; /* Center text */
`;

const SpacedHorizontalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BuyButton = styled.button`
  padding: 10px 16px;
  background-color: #ff0000; /* Red background */
  color: #000; /* Black text color */
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 700;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: transparent;
    color: #ff0000; /* Red on hover */
    border: 3px solid #ff0000; /* Red border */
  }
`;

const NikeLogo = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: auto;
    height: 13px;
  }
  background-color: #000; /* Black background */
`;

export function Details() {
  return (
    <DetailsContainer>
      <SmallText>ELICIT '24</SmallText>
      <SpacedHorizontalContainer>
        <MediumText></MediumText>
      </SpacedHorizontalContainer>
      <Marginer direction="vertical" margin="1.2em" />
      <SpacedHorizontalContainer>
        <MediumText>YOUR NEXT SHOES</MediumText>
      </SpacedHorizontalContainer>
      <NikeLogo>
        <img src={NikeImg.src} />
      </NikeLogo>
    </DetailsContainer>
  );
}
