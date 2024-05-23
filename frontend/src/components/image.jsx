import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Image = ({ image, size="60px", link=false, rectangle=false, name }) => {
    const serverLink=useSelector((state)=>state.serverLink);
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <img
        style={{ objectFit: "cover", borderRadius: rectangle?"0%":"50%", maxWidth:`${size}`, maxHeight:`${size}` }}
        alt="pic"
        src={link?`${serverLink}/assets/${image}`:image}
      />
      {name && <Typography sx={{
        textAlign:"center",
        marginBottom:"3px"
      }}>
        {name}
      </Typography>}
    </Box>
  );
};

export default Image;