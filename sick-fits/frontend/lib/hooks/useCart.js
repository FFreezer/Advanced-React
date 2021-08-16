import { useContext } from "react";
import { LocalStateContext } from "../contexts/cartContext";

export default function useCart() {
    const all = useContext(LocalStateContext);

    return all;
}