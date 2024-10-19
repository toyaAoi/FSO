import { Box } from "@mui/material";
import { Entry as EntryType } from "../types";
import { MdLocalHospital } from "react-icons/md";

const Entry = ({ entry }: { entry: EntryType }) => {
  let typeIcon;
  switch (entry.type) {
    case "HealthCheck":
      typeIcon = <MdLocalHospital />;
      break;
    default:
      typeIcon = <MdLocalHospital />;
  }

  return (
    <Box
      sx={{
        padding: "0 1rem",
        border: "1px solid black",
        borderRadius: "1rem",
        marginBottom: "1rem",
      }}
    >
      <p>
        {entry.date} {typeIcon}
      </p>
      <p>{entry.description}</p>
      <p>Diagnosed by {entry.specialist}</p>
    </Box>
  );
};

export default Entry;
