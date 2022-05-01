import * as React from 'react';
import styled from 'styled-components';

import {
  Input as MuiInput,
  Slider,
  Typography,
  Grid,
  Box,
} from '@mui/material';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function AgeSlider(props) {
  const { handleAgeValue } = props;
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    handleAgeValue(newValue);
  };

  const handleInputChange = (event) => {
    handleAgeValue(event.target.value === '' ? '' : Number(event.target.value));

    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      handleAgeValue(0);
      setValue(0);
    } else if (value > 100) {
      handleAgeValue(100);
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom fontSize={'2em'}>
        Age
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="medium"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
