import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {styled} from "@mui/system";
import {
  DarkMode,
  LightMode,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setBooks, setGenre, setPage, setTotalPages } from "../state/state";
import { useNavigate } from "react-router-dom";

const Navbar=({home})=>{
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const serverLink=useSelector((state)=> state.serverLink);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const currGenre = useSelector((state) => state.currGenre);
    const query = useSelector((state) => state.query);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;


    let fullName = ``;

    try {
        fullName = `${user.name}`;
    } catch (error) {
        fullName = `Unkmown User`;
    }

    const FlexBetween=styled(Box)({
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
    });

    const changeGenre=async (newGenre)=>{
      try {
        const response = await fetch(`${serverLink}/books/get-all/${newGenre}/1?q=${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.message) {
          dispatch(setBooks({ books: data.books }));
          dispatch(setGenre({ currGenre: newGenre }));
          dispatch(setPage({ currPage: 1 }));
          dispatch(setTotalPages({totalPages:data.totalPages}));
        } else {
          alert("Cannot fetch books due to :\n"+data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    }

    return <Box height="5rem">
    <FlexBetween padding="1rem 6%" backgroundColor={alt} position="fixed" width="100%" zIndex="1000" >
    <FlexBetween gap="1.75rem">
      <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 2rem, 2.25rem)"
        color="primary"
        onClick={() => navigate("/")}
        sx={{
          "&:hover": {
            color: primaryLight,
            cursor: "pointer",
          },
        }}
      >
        Book-Z
      </Typography>
    </FlexBetween>

    {/* DESKTOP NAV */}
    {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>

          {home && <FormControl variant="standard" value={currGenre}>
            <Select
              value={currGenre}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value="All">
                <Typography onClick={()=>changeGenre('All')}>All</Typography>
              </MenuItem>
              <MenuItem value="fiction">
                <Typography onClick={()=>changeGenre('fiction')}>Fiction</Typography>
              </MenuItem>
              <MenuItem value="non-fiction">
                <Typography onClick={()=>changeGenre('non-fiction')}>Non-Fiction</Typography>
              </MenuItem>
              <MenuItem value="sci-fi">
                <Typography onClick={()=>changeGenre('sci-fi')}>Sci-Fi</Typography>
              </MenuItem>
              <MenuItem value="fantasy">
                <Typography onClick={()=>changeGenre('fantasy')}>Fantasy</Typography>
              </MenuItem>
              
            </Select>
          </FormControl>}
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>

            {home && <FormControl variant="standard" value={currGenre}>
              <Select
                value={currGenre}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value="All">
                <Typography onClick={()=>changeGenre('All')}>All</Typography>
              </MenuItem>
              <MenuItem value="fiction">
                <Typography onClick={()=>changeGenre('fiction')}>Fiction</Typography>
              </MenuItem>
              <MenuItem value="non-fiction">
                <Typography onClick={()=>changeGenre('non-fiction')}>Non-Fiction</Typography>
              </MenuItem>
              <MenuItem value="sci-fi">
                <Typography onClick={()=>changeGenre('sci-fi')}>Sci-Fi</Typography>
              </MenuItem>
              <MenuItem value="fantasy">
                <Typography onClick={()=>changeGenre('fantasy')}>Fantasy</Typography>
              </MenuItem>
              </Select>
            </FormControl>}
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
    </Box>
}

export default Navbar;