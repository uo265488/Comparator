import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Grid } from "@mui/material";
import LoginButton from "./LoginButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user);
  console.log(isAuthenticated);
  console.log(isLoading);

  return (
    <Grid container
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{ 
              bgcolor: "background.default",
              height:"93vh"
            }}>
      {isAuthenticated && 
        <article> {JSON.stringify(user)}
        </article>
      }
    </Grid>
  );
};

export default Profile;