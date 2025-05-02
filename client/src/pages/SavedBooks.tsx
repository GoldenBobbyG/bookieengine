// // import { useState } from 'react';
// import { Container, Card, Button, Row, Col } from 'react-bootstrap';
// import { useQuery, useMutation } from '@apollo/client';

// import { GET_ME } from '../utils/queries';
// import { REMOVE_BOOK} from '../utils/mutations';
// import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';
// // import type { User } from '../models/User';

// const SavedBooks = () => {
//   const {loading,data } = useQuery(GET_ME);

//   // const userData = data?.me || {};
// console.log('GraphQL data:', data);
//   const [removeBook] = useMutation(REMOVE_BOOK, {
//     update(cache, { data: { removeBook } }) {
//       try {
//         // Update the me object in the cache
//         cache.writeQuery({
//           query: GET_ME,
//           data: { me: removeBook },
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     },
//   });


//  // Create function that accepts the book's mongo _id value as param and deletes the book from the database
//  const handleDeleteBook = async (bookId: string) => {
//   const token = Auth.loggedIn() ? Auth.getToken() : null;

//   if (!token) {
//     return false;
//   }

//   try {
//     // Execute removeBook mutation instead of the deleteBook() function
//      await removeBook({
//       variables: { bookId }
//     });

//     // Upon success, remove book's id from localStorage
//     removeBookId(bookId);
//   } catch (err) {
//     console.error(err);
//   }
// };

// // If data isn't here yet, say so
// if (loading) {
//   return <h2>LOADING...</h2>;
// }

// return (
//   <>
//     <div className='text-light bg-dark p-5'>
//       <Container>
//         {userData.username ? (
//           <h1>Viewing {userData.username}'s saved books!</h1>
//         ) : (
//           <h1>Viewing saved books!</h1>
//         )}
//       </Container>
//     </div>
//     <Container>
//       <h2 className='pt-5'>
//         {userData.savedBooks?.length
//           ? `Viewing ${userData.savedBooks.length} saved ${
//               userData.savedBooks.length === 1 ? 'book' : 'books'
//             }:`
//           : 'You have no saved books!'}
//       </h2>
//       <Row>
//         {userData.savedBooks.map((book) => {
//           return (
//             <Col md='4' key={book.bookId}>
//               <Card border='dark'>
//           {book.image ? (
//             <Card.Img
//               src={book.image}
//               alt={`The cover for ${book.title}`}
//               variant='top'
//             />
//           ) : null}
//           <Card.Body>
//             <Card.Title>{book.title}</Card.Title>
//             <p className='small'>Authors: {book.authors.join(', ')}</p>
//             <Card.Text>{book.description}</Card.Text>
//             <Button
//               className='btn-block btn-danger'
//               onClick={() => handleDeleteBook(book.bookId)}
//             >
//               Delete this Book!
//             </Button>
//           </Card.Body>
//               </Card>
//             </Col>
//           );
//         })}
//       ``
//       </Row>
//     </Container>
//   </>
// );
// };

// export default SavedBooks;

import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || { savedBooks: [] };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });

      // Remove book ID from localStorage
      removeBookId(bookId);

      // Refresh user data
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: any) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;