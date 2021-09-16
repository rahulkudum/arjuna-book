import React, { createContext, useState } from "react";
import { useLocal } from "./hook";

export const CartBooks = createContext();

export function TotalStorage({ children }) {
 const [cartBooks, setCartBooks] = useLocal("cart-books", []);

 return <CartBooks.Provider value={[cartBooks, setCartBooks]}>{children}</CartBooks.Provider>;
}
