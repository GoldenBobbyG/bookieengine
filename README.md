🚀 Challenge Overview
The goal of this project was to transform an existing RESTful MERN application into a fully functional GraphQL-powered app. This includes:

Setting up an Apollo Server for GraphQL queries and mutations

Integrating authentication middleware for secure GraphQL communication

Implementing an Apollo Provider on the client side

Deploying the full-stack app using Render and MongoDB Atlas

📖 User Story
AS AN avid reader
I WANT to search for new books to read
SO THAT I can keep a list of books to purchase

✅ Acceptance Criteria
When the search engine loads, users see a menu with Search for Books and Login/Signup, along with a search input and button.

Users can search for books without logging in, and view title, author, description, image, and a Google Books link.

The Login/Signup modal allows toggling between the two.

Signup: enter username, email, and password.

Login: enter email and password.

Upon login or signup, the menu updates to include Search for Books, Saved Books, and Logout.

Logged-in users can:

Save books from the search results

View saved books with all relevant details

Remove books from their list

Logout returns the menu to Search for Books and Login/Signup.

🛠️ Technologies Used
Frontend: React, Apollo Client, Bootstrap

Backend: Node.js, Express, Apollo Server

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT)

API: Google Books API

Deployment: Render + MongoDB Atlas

🔧 Installation
Prerequisites
Node.js (v14+)

MongoDB Atlas account

npm or yarn

## Contributions
None

## Notes

Wasn't able to deploy to Render I am receiving an error can not duplicate js file. 


## License

MIT License


