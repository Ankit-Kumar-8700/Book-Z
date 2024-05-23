import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import styled from "@emotion/styled";
import Dropzone from "react-dropzone";
import FormikSelect from "../components/formikSelect";
import Navbar from "../components/navbar";
import { useNavigate, useParams } from 'react-router-dom';
import Image from "../components/image";



const bookSchema = yup.object().shape({
    title: yup.string().required("required"),
    author: yup.string().required("required"),
    genre: yup.string().required("required"),
    yearPublished: yup.number().required("required"),
  });
  
  const initialValues ={
    title: "",
    author: "",
    genre: "",
    yearPublished: 0,
  };

const NewBook=({pageType,title,submitText})=>{
  const navigate=useNavigate();
    const serverLink=useSelector((state) => state.serverLink);
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const medium = palette.neutral.medium;
  let [file,setFile]=useState(null);
  let [picPath,setPicPath]=useState(null);
  const { id } = useParams();


  const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  });

  const VerticalFlex = styled(Box)({
    display: "flex",
    flexDirection: "column",
    width:"100%"
  });

  const getBook = async ()=>{
    try {
      const response = await fetch(`${serverLink}/books/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(!data.message){
        initialValues.title=data.book.title;
        initialValues.author=data.book.author;
        initialValues.genre=data.book.genre;
        initialValues.yearPublished=data.book.yearPublished;
        
        setPicPath(data.book.picPath);
      } else {
        alert("Book details weren't fetched due to:\n"+data.message);
      }
      
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(()=>{
    if(pageType!=='new'){
      getBook();
    }
  },[]);

  const addBook = async (values, onSubmitProps) => {
    try {
        if(!file){
            return alert("Upload an image first.");
        }
        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return alert("Upload an image. Selected file is not an image!");
          }
        let extraValues={
            userId:_id,
            file:file,
            data:file.name
        }
        values={...values,...extraValues};
        const formData=new FormData();
        for(const key in values){
            formData.append(key,values[key]);
        }
    
    const savedBookResponse = await fetch(
      `${serverLink}/books/create`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const savedBook = await savedBookResponse.json();
    
    if (!savedBook.message) {
        alert("Book has been created.")
      } else {
        alert("Book isn't created due to:\n"+savedBook.message)
      }
      
    } catch (error) {
      alert(error.message);
    }
  };

  const updateBook = async (values, onSubmitProps) => {
    try {
        values={...values,userId:_id};
    
        const response = await fetch(`${serverLink}/books/update/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
    const savedBook = await response.json();
    
    if (!savedBook.message) {
        alert("Book has been updated.")
      } else {
        alert("Book isn't updated due to:\n"+savedBook.message)
      }
      
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if(pageType==="new") await addBook(values, onSubmitProps);
    else if(pageType==="update") await updateBook(values, onSubmitProps);
    else navigate("/");
  };

  const genres = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'fantasy', label: 'Fantasy' },
  ];

  return (<>
  <Navbar />
  <Box display="flex" alignItems="center" justifyContent="center" >
  <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 2rem, 2.25rem)"
        color="primary"
      >
        {title}
      </Typography>
  </Box>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={bookSchema}
    //   initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
    //   validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
            <Box display={isNonMobile?"flex":"block"}
                alignItems="center"
                justifyContent="center"
            >
                <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            margin="5px 10px"
            mt="1rem"
            p="1rem"
            height="100%"
            width={isNonMobile?"40%":"95%"}
          >
            {pageType==="new" && <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              width="100%"
              multiple={false}
              onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
              >
              {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    height={isNonMobile?"200px":"100%"}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!file ? (
                      <p>Add image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{file.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {file && (
                    <IconButton
                      onClick={() => setFile(null)}
                      sx={{ width: "40px" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>}
            {pageType!=="new" && <Image size="250px" image={picPath} link={true} rectangle={true} name={null} />}
          </Box>
          <VerticalFlex>
          <TextField
                  label="Title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  disabled={pageType==="view"}
                  error={
                    Boolean(touched.title) && Boolean(errors.title)
                  }
                  helperText={touched.title && errors.title}
                  sx={{margin:"15px 10px"}}
                />
          <TextField
                  label="Author"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.author}
                  name="author"
                  disabled={pageType==="view"}
                  error={
                    Boolean(touched.author) && Boolean(errors.author)
                  }
                  helperText={touched.author && errors.author}
                  sx={{margin:"15px 10px"}}
                />
            <FormikSelect name="genre" label="Genre" disabled={pageType==="view"} options={genres} sx={{margin:"15px 10px"}} />

          <TextField
                  label="Publishing Year"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.yearPublished}
                  name="yearPublished"
                  disabled={pageType==="view"}
                  error={
                    Boolean(touched.yearPublished) && Boolean(errors.yearPublished)
                  }
                  helperText={touched.yearPublished && errors.yearPublished}
                  sx={{margin:"15px 10px"}}
                />
          </VerticalFlex>
            </Box>


          {/* BUTTONS */}
          <Box sx={{p:"2rem 1rem"}}>
            <Button
              type="submit"
              sx={{
                p: "1rem",
                width:"100%",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {submitText}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
}

export default NewBook;