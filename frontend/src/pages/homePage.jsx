import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Pagination,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { ArrowRight, Check, DeleteForever, Edit, ManageAccounts, Search } from "@mui/icons-material";
import styled from "@emotion/styled";
import logo from "../images/logo.png";
import Image from "../components/image";
import { useNavigate } from "react-router-dom";
import { setBooks, setUser, setPage, setTotalPages, setQuery } from "../state/state";

function HomePage() {
      const navigate=useNavigate();

    // const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const serverLink=useSelector((state)=> state.serverLink);
    const token = useSelector((state) => state.token);
    let currGenre = useSelector((state) => state.currGenre);
    let currPage = useSelector((state) => state.currPage);
    let books = useSelector((state) => state.books);
    let query = useSelector((state) => state.query);
    let totalPages = useSelector((state) => state.totalPages);
    const { _id,name,email } = useSelector((state) => state.user);
    const dispatch=useDispatch();

    const theme = useTheme();
    const primaryMain = theme.palette.primary.main;

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    const getUser = async () => {
      const response = await fetch(`${serverLink}/user/${_id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if(data){
        dispatch(
          setUser({
            user: data,
          })
        );
      } else {
        alert("User is not logged in.");
        // dispatch(setLogout());
      }
    };

    const getBooks=async (newPage=1,qry="")=>{
      try {
        const response = await fetch(`${serverLink}/books/get-all/${currGenre}/${newPage}?q=${qry}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.message) {
          dispatch(setBooks({ books: data.books }));
          dispatch(setPage({ currPage: newPage }));
          dispatch(setTotalPages({totalPages:data.totalPages}));
          // setCurrGenre(newGenre);
        } else {
          alert("Cannot fetch books due to :\n"+data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };

    const deleteBook= async (bookId)=>{
        try {
          const response = await fetch(`${serverLink}/books/delete/${bookId}?q=${query}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currGenre:currGenre,
              currPage:currPage,
              userId:_id
            }),
          });
          const data = await response.json();
          if (!data.message) {
            dispatch(setBooks({ books: data.books }));
            dispatch(setPage({ currPage: data.page }));
            dispatch(setTotalPages({totalPages:data.totalPages}));
            alert("Book deleted successfully.");
            // setCurrGenre(newGenre);
          } else {
            alert("Cannot delete the book due to :\n"+data.message);
          }
        } catch (error) {
          alert(error.message);
        }
    }

    const changeName=async () =>{
      const desc=document.getElementById("changeName");
        if(desc.value.length===0){
          alert("Name can't be empty");
          return;
        }
      const response = await fetch(`${serverLink}/user/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        body: JSON.stringify({name:desc.value})
      });
      const data = await response.json();
      if(data){
        dispatch(
          setUser({
            user: data,
          })
        );
        desc.value="";
      } else {
        alert("User is not logged in.");
        // dispatch(setLogout());
      }
    }

    useEffect(()=>{
      getUser();
      getBooks(1,query);
    },[]);

    const handlePageChange=(event,value)=>{
      getBooks(value,query);
    }
    const handleSearch= async ()=>{
      const qry=document.getElementById("searchQuery");
      dispatch(
        setQuery({
          query: qry.value,
        })
      );
      await getBooks(1,qry.value);
    }
    const goToHome= async ()=>{
      dispatch(
        setQuery({
          query: "",
        })
      );
      await getBooks(1,"");
    }

    const SpecialButton=styled(IconButton)({
      backgroundColor: `${primaryMain} !important`,
      margin: "1rem",
      position: "fixed",
      zIndex: "100",
      boxShadow: "2px 2px 2px black",
      color: "black"
  });

    const VerticalFlex=styled(Box)({
      display:"flex",
      flexDirection:"column"
    })

    const CenteredBox=styled(Box)({
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    })

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation"
    // onClick={toggleDrawer(false)}
    >
      <VerticalFlex>
        <CenteredBox paddingLeft="20%">
            <Image image={logo} size="75%" />
        </CenteredBox>
        <CenteredBox>
            <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="#c5b458"
            borderRadius="30px"
            padding="0 10px"
            margin="5px 15px"
            onClick={goToHome}
            sx={{
              "&:hover": {
                color: "#958636",
                cursor: "pointer",
                backgroundColor: `${primaryMain} !important`,
                boxShadow: `10px 0px darkblue, -10px 0px darkblue`,
                textShadow : "3px 3px 3px darkblue"
              },
            }}>
                Home
            </Typography>
        </CenteredBox>
        <Divider />
        <CenteredBox marginTop="10px">
            <Typography fontWeight="bold"
            fontSize="clamp(0.7rem, 1.4rem, 1.1rem)"
            color="#c5b458" >
                Welcome {name}
            </Typography>
        </CenteredBox>
        <Box margin="10px 5px" display="flex" flexWrap="wrap">
            <Typography
            color="#c5b458">
               Email : <p style={{fontWeight:"bold", margin:"0", padding:"0"}}>{email}</p>
            </Typography>
        </Box>
        <Box margin="10px 5px" color="#c5b458" >
            <Typography margin="3px 0">
                Wanna change your name?..
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
                  label="New Name"
                  id="changeName"
                />
            <IconButton margin="0 5px" onClick={changeName} >
                <Check />
            </IconButton>
            </Box>
        </Box>
        <CenteredBox>
            <Typography
            fontWeight="bold"
            fontSize="clamp(0.5rem, 1rem, 1.1rem)"
            color="#c5b458"
            borderRadius="30px"
            padding="0 20px"
            margin="5px 15px"
            border= "1px solid #c5b458"
            onClick={() => navigate("/new-book")}
            sx={{
              "&:hover": {
                color: "#958636",
                cursor: "pointer",
                backgroundColor: `${primaryMain} !important`,
                boxShadow: `10px 0px darkblue, -10px 0px darkblue`,
                textShadow : "1px 1px 1px darkblue",
                borderColor: `${primaryMain} !important`
              },
            }}>
                Add +
            </Typography>
        </CenteredBox>
        <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
                  label="Search here"
                  id="searchQuery"
                />
            <IconButton margin="0 5px" onClick={handleSearch} >
                <Search />
            </IconButton>
            </Box>
      </VerticalFlex>
    </Box>
  );

  return (
    <Box minHeight="100vh">
      <Navbar home={true} />
      <SpecialButton  onClick={toggleDrawer(true)}><ManageAccounts /> <ArrowRight /></SpecialButton>
        <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
        </Drawer>
      <Box display="flex" alignItems="center" justifyContent="center" >
        <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
            >
              {query!==""?"Query : "+query:"Home"}
            </Typography>
        </Box>
      <Box
        width="100%"
        display="flex"
        padding="1rem"
        flexWrap="wrap"
        gap="1.5rem"
        justifyContent="space-between"
      >
        {books && books.map((book)=>{
          return <Box key={book._id} padding="2px" sx={{
            boxShadow: `7px 7px 7px gray`,
            height: "260px",
            width: "200px",
            "&:hover": {
              cursor: "pointer",
              boxShadow: `7px 7px 7px ${primaryMain}`,
              textShadow : "1px 1px 1px darkblue",
              border: `1px solid ${primaryMain} !important`,
              padding: "1px",
            },
          }}>
            <Image size="200px" image={book.picPath} link={true} rectangle={true} name={book.title} />
            <Box display="flex" alignItems="center" justifyContent={book.userId===_id?"space-between":"center"}>
            {book.userId===_id && <IconButton sx={{
              margin:"0 5px",
              padding: "5px"
            }} onClick={()=>{navigate(`/update/${book._id}`)}} >
                <Edit fontSize="small" />
            </IconButton>}
            <IconButton sx={{
              margin:"0 5px",
              padding: "5px",
              fontSize: "small",
              border: "1px solid",
              borderRadius: "15px"
            }} onClick={()=>{navigate(`/book/${book._id}`)}} >
                View More
            </IconButton>
            {book.userId===_id && <IconButton sx={{
              margin:"0 5px",
              padding: "5px"
            }}  onClick={()=>{deleteBook(book._id)}} >
                <DeleteForever fontSize="small" />
            </IconButton>}
            </Box>
          </Box>
        })}
      </Box>
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      margin="20px 0"
    >
      {Number(totalPages)>1 && <Pagination count={totalPages} page={currPage} size="small" onChange={handlePageChange} color="primary" sx={{
        background:"rgba(125,125,125,0.2)",
        borderRadius:"15px",
        padding:"5px 10px"
      }} />}
    </Box>
    {Number(totalPages)===0 && <CenteredBox sx={{
      fontSize:"30px",
      fontWeight:"700",
      color:"gray"
    }} >No Books to Display</CenteredBox>}
    </Box>
  );
}

export default HomePage;
