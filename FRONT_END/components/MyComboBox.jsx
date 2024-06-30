import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function MyComboBox(props) {

  const handleChange = (event) => {
    props.setSupermercado(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
        <InputLabel id="label" htmlFor={'supermercado-id'}>Supermercado</InputLabel>
        <Select
          labelId="label"
          id="select-helper"
          value={props.supermercado}
          label="Supermercado"
          onChange={handleChange}
          data-testid="combobox"
          inputProps={{ id: 'supermercado-id' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          
          {props.supermercados.map(s =>
            <MenuItem value={s} key={s}> {s}</MenuItem>)}
        </Select>
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}
