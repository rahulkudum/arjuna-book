import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { CartBooks } from "../context/storage";
import logo from "../images/logo.png";

import Icons from "../images/sprite.svg";

function loadRazorpay() {
 return new Promise((resolve) => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  document.body.appendChild(script);
  script.onload = () => {
   resolve(true);
  };
  script.onerror = () => {
   resolve(false);
  };
 });
}

function Pform() {
 const [name, setName] = useState();
 const [phno, setPhno] = useState();
 const [email, setEmail] = useState();
 const [address, setAddress] = useState({ a1: "", a2: "", state: "", pin: "" });
 const [bookList, setBookList] = useContext(CartBooks);

 let tprice = 0;

 async function showRazorpay() {
  const resp = await loadRazorpay();

  if (!resp) {
   alert("failed to load");
   return;
  }

  let books = "";

  for (let i = 0; i < bookList.length; i++) {
   if (bookList[i].quantity > 0) books += bookList[i].quantity + " copies of " + bookList[i].title + "\n";
  }
  console.log(books);

  const data = await axios.post("https://arjunadb.herokuapp.com/payment/pay", { price: tprice }).then((res) => res.data);

  const options = {
   key: "rzp_test_WQG7sTrp3IgCeQ",
   amount: data.amount.toString(),
   currency: data.currency,
   name: "Arjuna Books",
   description: "Wisdom transforms lives",
   image: { logo },
   order_id: data.id,
   handler: function (response) {
    console.log(response.razorpay_payment_id);
    console.log(response.razorpay_order_id);
    console.log(response.razorpay_signature);
    alert("Thanks for Purchasing, you will be getting a mail about the order details");
    setBookList([]);
    window.location.replace("https://amalmdas.com/author/");
   },
   prefill: {
    name: name,
    email: email,
    contact: "+91" + phno,
   },
   notes: {
    name: name,
    address: address.a1 + "\n" + address.a2 + "\n" + address.state + "\n" + address.pin,
    books: books,
   },
   theme: {
    color: "#3399cc",
   },
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.on("payment.failed", function (response) {
   alert(response.error.code);
   alert(response.error.description);
   alert(response.error.source);
   alert(response.error.step);
   alert(response.error.reason);
   alert(response.error.metadata.order_id);
   alert(response.error.metadata.payment_id);
  });

  paymentObject.open();
 }

 return (
  <div class="pcontainer">
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
       Support
      </a>
     </div>
    </nav>
   </header>
   <main class="content">
    <h1 class="primary-heading primary-heading--left">Shopping Cart</h1>

    <div class="section-main">
     <form
      onSubmit={(e) => {
       e.preventDefault();
       showRazorpay();
      }}
      class="form"
     >
      <h2 class="secondary-heading secondary-heading--left">Shipping Address</h2>
      <div class="form__group">
       <input
        type="text"
        class="form__input"
        placeholder="Name"
        id="name"
        value={name}
        onChange={(e) => {
         setName(e.target.value);
        }}
        required
       />
       <label for="name" class="form__label">
        Name
       </label>
      </div>

      <div class="form__group">
       <input
        type="email"
        class="form__input"
        placeholder="Email"
        id="email"
        value={email}
        onChange={(e) => {
         setEmail(e.target.value);
        }}
        required
       />
       <label for="email" class="form__label">
        Email
       </label>
      </div>

      <div class="form__group">
       <input
        type="text"
        class="form__input"
        placeholder="Phone Number"
        id="number"
        pattern="^[0-9]{10}$"
        value={phno}
        onChange={(e) => {
         setPhno(e.target.value);
        }}
        required
       />
       <label for="number" class="form__label">
        Phone Number
       </label>
      </div>

      <div class="form__group">
       <input
        type="text"
        class="form__input"
        placeholder="Flat / Plot, Society, Street"
        id="address1"
        value={address.a1}
        onChange={(e) => {
         setAddress((prev) => {
          let dum = { ...prev };
          dum.a1 = e.target.value;
          return dum;
         });
        }}
        required
       />
       <label for="address1" class="form__label">
        Flat / Plot, Society, Street
       </label>
      </div>

      <div class="form__group">
       <input
        type="text"
        class="form__input"
        placeholder="City / Town, State"
        id="address2"
        value={address.state}
        onChange={(e) => {
         setAddress((prev) => {
          let dum = { ...prev };
          dum.state = e.target.value;
          return dum;
         });
        }}
        required
       />
       <label for="address2" class="form__label">
        City / Town, State
       </label>
      </div>

      <div class="form__group">
       <input
        type="text"
        class="form__input"
        placeholder="Pin Code"
        id="pincode"
        value={address.pin}
        onChange={(e) => {
         setAddress((prev) => {
          let dum = { ...prev };
          dum.pin = e.target.value;
          return dum;
         });
        }}
        required
       />
       <label for="pincode" class="form__label">
        Pin Code
       </label>
      </div>

      <div class="form__group center-text margin-top--big">
       <button class="btn btn--sail">Proceed to Checkout</button>
      </div>
     </form>

     <div class="cart">
      <p class="cart__label">Your Cart</p>
      {bookList.map((book, i) => {
       tprice += book.quantity * book.price;
       if (book.quantity > 0) {
        return (
         <div class="cart__book">
          <img src={book.image} />
          <div>
           <h4 class="cart__book__title">{book.title}</h4>
           <div class="cart__book__quantity">
            <p>Quantity</p>

            <div class="cart__book__quantity__second">
             <button
              class="cart__book__change-btn"
              onClick={() => {
               book.quantity++;
               setBookList((prev) => {
                let dum = [...prev];

                dum[i] = book;

                return dum;
               });
              }}
             >
              <svg class="cart__book__change-icon">
               <use xlinkHref={`${Icons}#icon-plus`}></use>
              </svg>
             </button>

             <span>{book.quantity}</span>

             <button
              class="cart__book__change-btn"
              onClick={() => {
               book.quantity--;
               setBookList((prev) => {
                let dum = [...prev];

                dum[i] = book;

                return dum;
               });
              }}
             >
              <svg class="cart__book__change-icon">
               <use xlinkHref={`${Icons}#icon-minus`}></use>
              </svg>
             </button>
            </div>
           </div>
           <div class="cart__book__price">
            <p>Price</p> <p class="cart__book__price__second">RS.{book.price}</p>
           </div>
          </div>
         </div>
        );
       }
      })}

      <div>
       <div class="cart__line">
        <p>Price</p> <p class="cart__line__second">Rs.{tprice}</p>
       </div>
       <div class="cart__line">
        <p>Promo Code</p> <p class="cart__line__second">Promo Code</p>
       </div>
       <div class="cart__line">
        <p>Discount</p> <p class="cart__line__second">Rs.100</p>
       </div>
       <div class="cart__line">
        <p>Delivery Charges</p> <p class="cart__line__second">Rs.100</p>
       </div>

       <div class="cart__line cart__total">
        <p>Total</p> <p>{tprice}</p>
       </div>
      </div>
     </div>
    </div>
   </main>
  </div>
 );
}

export default Pform;

// <div>
//    <div class="bg-light">
//     <div class="container">
//      <div class="py-5 text-center">
//       <h2>Checkout form</h2>
//       <p class="lead">Thank You for purchasing our book please fill the below form to place your order.</p>
//       <button
//        onClick={() => {
//         window.location.replace("https://amalmdas.com");
//        }}
//       >
//        Test
//       </button>
//      </div>

//      <div class="row">
//       <div class="col-md-4 order-md-2 mb-4">
//        <h4 class="d-flex justify-content-between align-items-center mb-3">
//         <span class="text-muted">Your cart</span>
//         <span class="badge badge-secondary badge-pill">3</span>
//        </h4>
//        <ul class="list-group mb-3">
//         {bookList.map((val) => {
//          tprice += val.quantity * val.price;
//          if (val.quantity > 0) {
//           return (
//            <li class="list-group-item d-flex justify-content-between lh-condensed">
//             <div>
//              <h6 class="my-0">{val.name}</h6>
//              <small class="text-muted">
//               {val.quantity} X {val.price}
//              </small>
//             </div>
//             <span class="text-muted">Rs. {val.quantity * val.price}</span>
//            </li>
//           );
//          }
//         })}

//         <li class="list-group-item d-flex justify-content-between bg-light">
//          <div class="text-success">
//           <h6 class="my-0">Promo code</h6>
//           <small>EXAMPLECODE</small>
//          </div>
//          <span class="text-success">-50</span>
//         </li>
//         <li class="list-group-item d-flex justify-content-between">
//          <span>Total (INR)</span>
//          <strong>Rs. {tprice}</strong>
//         </li>
//        </ul>
//       </div>
//       <div class="col-md-8 order-md-1">
//        <h4 class="mb-3"> Your Details</h4>
//        <form
//         class="needs-validation"
//         onSubmit={(e) => {
//          e.preventDefault();
//          showRazorpay();
//         }}
//         noValidate
//        >
//         <div class="row">
//          <div class="col-md-6 mb-3">
//           <label for="username">Fulll Name</label>
//           <div class="input-group">
//            <input
//             type="text"
//             name="name"
//             class="form-control"
//             id="defaultFormRegisterNameEx"
//             value={name}
//             onChange={(e) => {
//              setName(e.target.value);
//             }}
//             placeholder=""
//             required
//            />
//            <div class="invalid-feedback">Your Name is required.</div>
//           </div>
//          </div>
//          <div class="col-md-6 mb-3">
//           <label for="phno">Ph No</label>
//           <div class="input-group">
//            <input
//             type="text"
//             name="phno"
//             class="form-control"
//             value={phno}
//             onChange={(e) => {
//              setPhno(e.target.value);
//             }}
//             placeholder=""
//             pattern="^[0-9]{10}$"
//             required
//             id="defaultFormRegisterNumberEx"
//            />
//            <div class="invalid-feedback">Your Phone Number is required.</div>
//           </div>
//          </div>
//         </div>

//         <div class="mb-3">
//          <label for="email">Email</label>
//          <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={(e) => {
//            setEmail(e.target.value);
//           }}
//           placeholder="you@example.com"
//           required
//          />
//          <div class="invalid-feedback">Please enter a valid email address for shipping updates.</div>
//         </div>

//         <div class="mb-3">
//          <label for="address">Address</label>
//          <input
//           name="address"
//           type="text"
//           class="form-control"
//           id="address"
//           value={address.a1}
//           onChange={(e) => {
//            setAddress((prev) => {
//             let dum = { ...prev };
//             dum.a1 = e.target.value;
//             return dum;
//            });
//           }}
//           placeholder="House No, Street..."
//           required
//          />
//          <div class="invalid-feedback">Please enter your shipping address.</div>
//         </div>

//         <div class="mb-3">
//          <label for="address2">
//           Address 2 <span class="text-muted">(Optional)</span>
//          </label>
//          <input
//           type="text"
//           class="form-control"
//           id="address2"
//           value={address.a2}
//           onChange={(e) => {
//            setAddress((prev) => {
//             let dum = { ...prev };
//             dum.a2 = e.target.value;
//             return dum;
//            });
//           }}
//           placeholder="LandMark"
//          />
//         </div>

//         <div class="row">
//          <div class="col-md-4 mb-3">
//           <label for="state">State</label>
//           <select
//            name="state"
//            class="custom-select d-block w-100"
//            id="state"
//            value={address.state}
//            onChange={(e) => {
//             setAddress((prev) => {
//              let dum = { ...prev };
//              dum.state = e.target.value;
//              return dum;
//             });
//            }}
//            required
//           >
//            <option value="">Choose...</option>
//            <option>Andhra Pradesh</option>
//            <option>Telangana</option>
//           </select>
//           <div class="invalid-feedback">Please provide a valid state.</div>
//          </div>
//          <div class="col-md-3 mb-3">
//           <label for="zip">Zip</label>
//           <input
//            name="zip"
//            type="text"
//            class="form-control"
//            id="zip"
//            value={address.pin}
//            onChange={(e) => {
//             setAddress((prev) => {
//              let dum = { ...prev };
//              dum.pin = e.target.value;
//              return dum;
//             });
//            }}
//            placeholder=""
//            required
//           />
//           <div class="invalid-feedback">Zip code required.</div>
//          </div>
//         </div>
//         <button class="btn btn-primary btn-lg btn-block" type="submit">
//          Continue to checkout
//         </button>
//        </form>
//       </div>
//      </div>
//     </div>
//    </div>
//   </div>
