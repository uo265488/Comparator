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
          console.log("Text changed:", e.target.value); // Debugging log
          onChangeText(e.target.value);
        }}
        fullWidth
        onKeyPress={(e) => {
          if (onKeyPress) {
            console.log("Key pressed:", e.key); // Debugging log
            onKeyPress(e);
          }
        }}
        autoFocus={autoFocus}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => {
              console.log("Search icon clicked"); // Debugging log
              onIconPress();
            }} edge="end">
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default Searchbar;
