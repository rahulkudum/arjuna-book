import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

import "../css/main.css";

import logo from "../images/logo.png";
import Icons from "../images/sprite.svg";

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
  if (window.screen.width > 900) {
   let minus = Math.floor(window.devicePixelRatio) - 1;
   if (minus === -1) minus = 0;
   let pixelVal = 9 / (window.devicePixelRatio - minus);
   document.querySelector("html").style.fontSize = pixelVal + "px";
  }
 }, []);

 useEffect(() => {
  window.scrollTo(0, 0);
  axios
   .post("https://arjunadb.herokuapp.com/book/find", { name: name })
   .then((res) => {
    setBook(res.data);
    console.log(res.data);
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

 const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
   onMove,
   carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
   <button class="carousel-button carousel-button--right" onClick={() => onClick()}>
    <svg class="carousel-button__icon">
     <use xlinkHref={`${Icons}#icon-chevron-with-circle-right`}></use>
    </svg>
   </button>
  );
 };

 const CustomLeftArrow = ({ onClick, ...rest }) => {
  const {
   onMove,
   carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
   <button class="carousel-button carousel-button--left" onClick={() => onClick()}>
    <svg class="carousel-button__icon">
     <use xlinkHref={`${Icons}#icon-chevron-with-circle-left`}></use>
    </svg>
   </button>
  );
 };

 return (
  <>
   <div class="container">
    <header class="nav_header">
     <nav class="navigation">
      <img
       src={logo}
       alt="Arjuna logo"
       class="navigation__logo"
       onClick={() => {
        alert(`width:${window.screen.width} pixel-ratio:${window.devicePixelRatio}`);
       }}
      />
      <div class="navigation__link-box">
       <a href="https://amalmdas.com/author/" class="navigation__link">
        Books
       </a>
      </div>
      <div class="navigation__link-box">
       <a href="#" class="navigation__link">
        Webinars
       </a>
      </div>
     </nav>
    </header>
    <main>
     <div class="section-about">
      {book ? (
       <img src={book.image} class="cover" alt="book_image" />
      ) : (
       <>
        <div class="cover-skeleton cover-skeleton--desktop">
         <Skeleton width={450} height={620} />
        </div>
        <div class="cover-skeleton cover-skeleton--mobile">
         <Skeleton width={300} height={400} />
        </div>
       </>
      )}

      <div class="about" style={{ width: "100%" }}>
       <h1 class="about__title">{book ? book.title : <Skeleton />}</h1>
       <h2 class="about__subtitle">{book ? book.subtitle : <Skeleton />}</h2>
       <p class="about__desc">{book ? book.description : <Skeleton count={15} />}</p>
       <div class="about__button">
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
      </div>
     </div>
     <div class="div-chapters">
      <h1 class="primary-heading">Chapter-wise Summary</h1>
      <div class="section-carousel">
       {book ? (
        <Carousel
         renderButtonGroupOutside={true}
         swipeable={true}
         draggable={true}
         showDots={true}
         keyBoardControl={true}
         responsive={responsive}
         customRightArrow={<CustomRightArrow />}
         customLeftArrow={<CustomLeftArrow />}
        >
         {book.chapters.map((chapter, i) => {
          return (
           <div class="card">
            <div class="card__side card__side--front">
             <div class="card__front">
              <p>{i + 1}</p>
              <hr />
              <p>{chapter.name}</p>
             </div>
             <button
              class="card__manual"
              onClick={() => {
               let elements1 = document.querySelectorAll(".card__side--front");
               let elements2 = document.querySelectorAll(".card__side--back");

               if (elements1) {
                console.log("dsxc");
                elements1[i].classList.toggle("card__hover-front");
               }
               if (elements2) {
                elements2[i].classList.toggle("card__hover-back");
               }
              }}
             >
              Explore
             </button>
            </div>
            <div
             class="card__side card__side--back"
             onClick={() => {
              let elements1 = document.querySelectorAll(".card__side--front");
              let elements2 = document.querySelectorAll(".card__side--back");

              if (elements1) {
               console.log("dsxc");
               elements1[i].classList.toggle("card__hover-front");
              }
              if (elements2) {
               elements2[i].classList.toggle("card__hover-back");
              }
             }}
            >
             <div class="card__back">{chapter.desc}</div>
            </div>
           </div>
          );
         })}
        </Carousel>
       ) : null}
      </div>
     </div>

     <div class="section-carousel">
      <h1 class="primary-heading">Appreciation for the Book</h1>

      {book ? (
       <Carousel
        renderButtonGroupOutside={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        keyBoardControl={true}
        infinite={true}
        responsive={responsive}
        customRightArrow={<CustomRightArrow />}
        customLeftArrow={<CustomLeftArrow />}
       >
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

      <div class="section-books__container">
       {allBooks.map((currBook, i) => {
        if (currBook.title !== name) {
         return (
          <div
           class="book-box"
           onClick={() => {
            setBook(currBook);
            window.scrollTo(0, 0);
            history.push(`/book/${currBook.title}`);
           }}
          >
           <img src={currBook.image} alt="other-books" class="book-box__img" />
           <h3>{currBook.title}</h3>
           <h4>{currBook.subtitle}</h4>
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
