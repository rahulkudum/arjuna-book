import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

import "../css/main.css";

import logo from "../images/logo.png";

import { CartBooks } from "../context/storage";

const responsive = {
 superLargeDesktop: {
  // the naming can be any, depends on you.
  breakpoint: { max: 4000, min: 3000 },
  items: 5,
 },
 desktop: {
  breakpoint: { max: 3000, min: 1024 },
  items: 3,
 },
 tablet: {
  breakpoint: { max: 1024, min: 464 },
  items: 1,
 },
 mobile: {
  breakpoint: { max: 464, min: 0 },
  items: 1,
 },
};

function Book() {
 let { name } = useParams();
 let history = useHistory();
 const [cartBooks, setCartBooks] = useContext(CartBooks);
 const [book, setBook] = useState();
 const [chap, setChap] = useState(0);
 const [allBooks, setAllBooks] = useState([]);

 console.log(window.screen.width);

 useEffect(() => {
  alert(`width:${window.screen.width} pixel-ratio:${window.devicePixelRatio}`);

  if (window.screen.width > 900) {
   let minus = Math.floor(window.devicePixelRatio) - 1;
   if (minus === -1) minus = 0;
   let pixelVal = 9 / (window.devicePixelRatio - minus);
   document.querySelector("html").style.fontSize = pixelVal + "px";
  }
 }, []);

 useEffect(() => {
  axios
   .post("https://arjunadb.herokuapp.com/book/find", { name: name })
   .then((res) => {
    setBook(res.data);
    console.log(res.data);
    window.scrollTo(0, 0);
    axios
     .get("https://arjunadb.herokuapp.com/book/")
     .then((resp) => {
      setAllBooks(resp.data);
     })
     .catch((err) => {
      console.error(err);
     });
   })

   .catch((err) => {
    console.log(err);
   });

  console.log(book);
 }, [name]);

 return (
  <>
   <div class="container">
    <header class="nav_header">
     <nav class="navigation">
      <img src={logo} alt="Arjuna logo" class="navigation__logo" />
      <div class="navigation__link-box">
       <a href="#" class="navigation__link">
        Books
       </a>
      </div>
      <div class="navigation__link-box">
       <a href="#" class="navigation__link">
        Webinars
       </a>
      </div>
      <div class="navigation__link-box">
       <a href="#" class="navigation__link">
        Courses
       </a>
      </div>
      <div class="navigation__link-box">
       <a href="#" class="navigation__link">
        Contests
       </a>
      </div>
     </nav>
    </header>
    <main>
     <div class="section-about">
      <div>{book ? <img src={book.image} class="cover" alt="book_image" /> : <Skeleton height={650} />}</div>
      <div class="about" style={{ width: "100%" }}>
       <h1 class="about__title">{book ? book.title : <Skeleton />}</h1>
       <h2 class="about__subtitle">{book ? book.subtitle : <Skeleton />}</h2>
       <p class="about__desc">{book ? book.description : <Skeleton count={15} />}</p>
      </div>
     </div>
     <div class="div-chapters">
      <h1 class="primary-heading">Chapter-wise Summary</h1>
      <div class="section-chapters">
       <nav class="sidebar">
        {book ? (
         <ul class="side-nav">
          {" "}
          {book.chapters.map((chapter, i) => {
           if (i === chap) {
            return (
             <li class="side-nav__item side-nav__item--active">
              <button
               onClick={() => {
                setChap(i);
               }}
               class="side-nav__link"
              >
               {chapter.name}
              </button>
             </li>
            );
           } else {
            return (
             <li class="side-nav__item ">
              <button
               onClick={() => {
                setChap(i);
               }}
               class="side-nav__link"
              >
               {chapter.name}
              </button>
             </li>
            );
           }
          })}{" "}
         </ul>
        ) : (
         <Skeleton height={40} count={8} />
        )}
       </nav>
       {book
        ? book.chapters.map((chapter, i) => {
           if (i === chap) {
            return <div class="chap-desc">{chapter.desc}</div>;
           }
          })
        : null}
      </div>
     </div>

     <div class="section-carousel">
      <h1 class="primary-heading">Appreciation for the Book</h1>

      {book ? (
       <Carousel swipeable={true} draggable={true} showDots={true} keyBoardControl={true} infinite={true} responsive={responsive}>
        {book.testimonials.map((testimonial, i) => {
         return (
          <div class="testimonial-box">
           <div class="testimonial-box__comment">
            <p>{testimonial.comment}</p>
           </div>
           <p class="testimonial-box__name">{testimonial.name}</p>
           <p class="testimonial-box__position">{testimonial.position}</p>
          </div>
         );
        })}
       </Carousel>
      ) : null}
     </div>

     {/* <div class="flex-box">
      <p>Ac feugiat sed lectus vestibulum mattis ullamcorper velit sed.</p>
      <button class="btn">Add to Cart!</button>
     </div> */}

     <div class="section-books">
      <h1 class="primary-heading">Other Titles in our Wisdom Library</h1>
      <h2 class="secondary-heading">Ac feugiat sed lectus vestibulum mattis ullamcorper velit</h2>
      <div class="section-books__container">
       {allBooks.map((currBook, i) => {
        if (currBook.title !== name) {
         return (
          <div
           class="book-box"
           onClick={() => {
            history.push(`/book/${currBook.title}`);
           }}
          >
           <img src={currBook.image} alt="other-books" class="book-box__img" />
           <h3>{currBook.title}</h3>
           <h4>{currBook.subtitle}</h4>
           <p>{currBook.description.slice(0, 300)} ...</p>
          </div>
         );
        }
       })}
      </div>
     </div>
     <div class="flex-box">
      <p>Don't delay Wisdom!</p>
      <button
       class="btn btn--playball"
       onClick={() => {
        setCartBooks((prev) => {
         let dum = [...prev];
         let f = -1;
         for (let k = 0; k < dum.length; k++) {
          if (dum[k].title === name) {
           dum[k].quantity = 1;
           f = k;
           break;
          }
         }
         if (book) {
          book.quantity = 1;
          if (f === -1) dum.push(book);
         }

         return dum;
        });
        history.push("/payment");
       }}
      >
       Buy Now!
      </button>
     </div>
    </main>
   </div>
  </>
 );
}

export default Book;
