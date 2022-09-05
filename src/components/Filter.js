import { Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export const Filter = ({ filter, handlerFilter }) => {
	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
		>
			<FormControl
				sx={{
					width: "110px",
					textAlign: "center",
				}}
			>
				<InputLabel>Filter</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={filter}
					label="Filter"
					onChange={(event) => handlerFilter(event)}
				>
					<MenuItem value={"newest"}>Newest</MenuItem>
					<MenuItem value={"oldest"}>Oldest</MenuItem>
				</Select>
			</FormControl>
		</Stack>
	);
};
