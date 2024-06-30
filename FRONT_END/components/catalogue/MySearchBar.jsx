import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Searchbar = ({
  id,
  value,
  onChangeText,
  onIconPress,
  placeholder,
  onKeyPress,
  autoFocus
}) => {
  return (
    <div>
      <TextField
        id={id}
        label={placeholder}
        value={value}
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
        fullWidth
        onKeyPress={(e) => {
          if (onKeyPress) {
            onKeyPress(e);
          }
        }}
        autoFocus={autoFocus}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => {
                onIconPress();
              }}
              edge="end"
              aria-label="Buscar"
            >
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default Searchbar;
