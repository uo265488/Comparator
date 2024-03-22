import styled from "@emotion/styled";
import { Button } from "react-native-paper";
import { Button as Button2} from "@mui/material";

export const StyledButton = styled(Button)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

export const StyledFilledButton = styled(Button2)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

export const StyledImg = styled("img")({
  margin: 20,
  marginLeft: 90,
  display: "inline-block",
  height: "500px",
  borderRadius: 25,
});

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Arial, Helvetica, sans-serif;
  border-bottom: 0.01em solid lightblue;
  padding-bottom: 2em;
  div {
    flex: 1;
  }
  .information,
  .buttons {
    display: flex;
    justify-content: space-between;
  }
  img {
    max-width: 10em;
    object-fit: cover;
    margin-left: 2em;
  }
`;