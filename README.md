** BACKEND **
1. Create a .env file with following details:
    MONGO_URL='Your MongoDB Atlas URI'
    PORT=8000
    JWT_SECRET="Your Secret Key"
2. Run 'npm i' in the terminal to install the node modules for backend.
3. Run 'npm start' to start the backend server.

** FRONTEND **
1. Run 'npm i' in the terminal to install the node modules for frontend.
2. Run 'npm start' to start the MERN web-app.

** Features **
Authentication (Login/Register)
Change UserName
Secure Password by BCrypt, and Token usage via JWT sign.
View all Books.
Create a new book.
View a specific book.
Update/Delete a book (You can't perform this operation on books created by other users.)
Light/Dark mode.
Filter Books according to Genre.
Pagination (Disappears when number of pages <= 1)
Search the books by query (Searches for the query string in Title or Author fields of Books).
Completely Responsive.
React-Redux for state management, and MaterialUI for frontend components.