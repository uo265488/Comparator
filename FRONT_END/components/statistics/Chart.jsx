import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from "recharts";
import Title from "./Title";
import { Paper, Grid, Box } from "@mui/material";

export default function Chart(props) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 240,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <Title>{props.title}</Title>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <img
              src={require("../../static/images/" + props.supermercado + ".png")}
              alt={props.supermercado}
              style={{
                width: '70%',
                height: '40%',
              }}
            />
          </Grid>
        </Grid>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={props.data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              dataKey="precio"
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: "middle",
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                Precio (EUR)
              </Label>
            </YAxis>
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="precio"
              stroke={theme.palette.primary.main}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </React.Fragment>
  );
}
