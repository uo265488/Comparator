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
        <InputLabel id="demo-simple-select-helper-label">Supermercado</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props.supermercado}
          label="Supermercado"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
         </MenuItem>
                  
                  {props.supermercados.map(s => <MenuItem value={s} key={s}> {s}</MenuItem>)}
        </Select>
        <FormHelperText>Selecciona un supermercado si quieres filtrar LaLista</FormHelperText>
      </FormControl>
    </div>
  );
}
