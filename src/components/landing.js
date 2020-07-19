import React, { useState } from "react";
import { Box, Grid, Paper, Tabs, Tab } from "@material-ui/core";
import TransactionLog from "./transactionlog";

const Landing = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <Box my="2em">
      </Box>
      <TransactionLog />
    </>
  );
};

export default Landing;