import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";

import MenuItem from "@mui/material/MenuItem";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FormControl, InputLabel } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  name: string | number,
  personName: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      personName.indexOf(`${name}`) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type MultipleSelectProps = {
  values: string[];
  title: string;
  options: { id: string | number; value: string }[];
  setValues: (v: string | string[]) => void;
};

export default function MultipleSelect({
  values,
  options,
  setValues,
  title,
}: MultipleSelectProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof values>) => {
    const {
      target: { value },
    } = event;
    setValues(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="multiple-chip-label">{title}</InputLabel>
      <Select
        fullWidth
        labelId="multiple-chip-label"
        multiple
        value={values}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={title} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={options.find((o) => o.id === value)?.value}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map(({ id, value }) => (
          <MenuItem key={id} value={id} style={getStyles(id, values, theme)}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
