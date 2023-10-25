import { Grid } from "@mui/material";
import { useAuth0 } from "react-native-auth0";
import { Title } from "react-native-paper";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [selectedList, setSelectedList] = useState();

  return (
    <Grid
      container
      className="App"
      sx={{
        bgcolor: "background.default",
        width: "100%",
        height: "100%",
        display: "grid",
        pb: { xs: 20, xl: 50 },
        pl: { xs: 4, sm: 8, md: 15 },
        pr: { xs: 4, sm: 10, md: 15 },
      }}
    >
      {isAuthenticated ? (
        <>
          <Title>{user.name}</Title>
          <Text>{user.email}</Text>
        </>
      ) : (
        <h1>Nada</h1>
      )}

      {console.log(user)}
    </Grid>
  );
}
