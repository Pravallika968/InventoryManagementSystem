import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import "./CustomerOrder.css";

const CustomerOrder = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({}); // Quantity per product

    const customer = JSON.parse(localStorage.getItem("loggedInCustomer"));

    // Fetch products from backend
    const getProducts = async () => {
        try {
            const res = await fetch("http://localhost:5050/api/products/all");
            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch products");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Handle quantity input change
    const handleQuantityChange = (productId, value) => {
        setQuantity({ ...quantity, [productId]: Number(value) });
    };

    // Send low-stock email to admin
    const sendLowStockEmail = (product) => {
        emailjs.send(
            "service_tieolux",
            "template_oei9qtt",
            {
                to_email: "pravallikapikkili7@gmail.com", // admin email
                customer_name: "Admin",
                product_name: product.name,
                quantity: product.stockQuantity,
                status_message: `Stock is low for this product: ${product.name}. Only ${product.stockQuantity} items left!`,
            },
            "uBkOlmzvdJNY-NYcB"
        ).then(() => {
            console.log(`Low stock email sent for ${product.name}`);
        }).catch((err) => {
            console.error("Failed to send low stock email:", err);
        });
    };

    // Place order
    const placeOrder = async (product) => {
        const qty = quantity[product.productId] || 1;

        if (!customer) {
            alert("Please login first");
            return;
        }

        // Customer's order quantity should not exceed current stock
        if (qty > product.stockQuantity) {
            alert(`Sorry, only ${product.stockQuantity} items available.`);
            return;
        }

        try {
            // Reduce stock in backend
            const res = await fetch(
                `http://localhost:5050/api/products/${product.productId}/reduceStock?quantity=${qty}`,
                { method: "PUT" }
            );
            const data = await res.json();

            if (res.status !== 200) {
                alert(`Order failed: ${data.message}`);
                return;
            }

            // Save order locally
            const orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push({ customerEmail: customer.email, product, quantity: qty });
            localStorage.setItem("orders", JSON.stringify(orders));

            // Send success email to customer
            emailjs.send(
                "service_plak9ka",
                "template_pm5ky6c",
                {
                    to_email: customer.email,
                    customer_name: customer.name,
                    product_name: product.name,
                    quantity: qty,
                    status_message: "Your order has been successfully placed!",
                },
                "uBkOlmzvdJNY-NYcB"
            );

            // Update frontend stock immediately
            const updatedProducts = products.map((p) =>
                p.productId === product.productId
                    ? { ...p, stockQuantity: p.stockQuantity - qty }
                    : p
            );
            setProducts(updatedProducts);

            // Alert success
            alert(`Order for "${product.name}" (Qty: ${qty}) placed successfully!`);

            // If remaining stock <=5, send low-stock email to admin
            const updatedProduct = updatedProducts.find(p => p.productId === product.productId);
            if (updatedProduct.stockQuantity <= 2) {
                sendLowStockEmail(updatedProduct);
            }

        } catch (err) {
            console.error(err);
            alert("Error placing order");
        }
    };

    return (
        <div className="customer-container">
            <h1 className="title">Available Products</h1>

            <div className="grid">
                {products.map((product) => (
                    <div key={product.productId} className="card">
                        <img
                            src={product.imageUrl || "/placeholder.png"}
                            alt={product.name}
                            className="card-img"
                        />
                        <h3>{product.name}</h3>
                        <p className="price">₹{product.price}</p>
                        <p className="desc">{product.description}</p>
                        <p className="stock">In Stock: {product.stockQuantity}</p>

                        {/* Quantity Selector */}
                        <input
                            type="number"
                            min="1"
                            max={product.stockQuantity}
                            value={quantity[product.productId] || 1}
                            onChange={(e) =>
                                handleQuantityChange(product.productId, e.target.value)
                            }
                            className="qty-input"
                        />

                        <button
                            className="order-btn"
                            onClick={() => placeOrder(product)}
                        >
                            Place Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerOrder;
